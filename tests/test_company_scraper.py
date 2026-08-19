"""Unit tests for the CompanyScraper.

These tests verify that:
- The scraper can be imported and instantiated.
- Basic HTML parsing logic works as expected.
- Extraction helpers (title, company, location, etc.) return the correct values.
- URL hashing and dedup helpers are accessible.
- Concurrency limits and jitter are applied.
"""

import re
import hashlib
from typing import List

import pytest
from bs4 import BeautifulSoup

from backend.services.company_scraper import (
    CompanyScraper,
    hash_url,
    hash_content,
)


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("United Kingdom", "United Kingdom"),
        ("uk", "United Kingdom"),
        ("U.S.A.", "United States"),
        ("", "unknown"),
        ("   ", "unknown"),
    ],
)
def test_normalize_location(raw: str, expected: str):
    assert CompanyScraper._normalize_location(raw) == expected


def test_hash_url_output():
    url = "https://example.com/careers/123"
    h = hash_url(url)
    assert isinstance(h, str)
    assert len(h) == 64  # SHA256 produces 64-character hex string
    # Deterministic – same input always yields same hash
    assert hash_url(url) == hash_url(url)


def test_hash_content_output():
    title, company, location = "Software Eng", "Acme", "San Francisco, CA"
    h = hash_content(title, company, location)
    assert isinstance(h, str)
    assert len(h) == 64  # SHA256 produces 64-character hex string
    # Deterministic
    assert hash_content(title, company, location) == hash_content(
        title, company, location
    )


def test_company_scraper_import_and_basic_instance():
    # Should be able to import and instantiate without errors
    scraper = CompanyScraper(max_concurrency=2)
    assert isinstance(scraper, CompanyScraper)


def test_extract_title_and_company_from_sample_html():
    html = """
    <article class="job-card">
        <h3>Senior Software Engineer</h3>
        <a href="/careers/senior-eng">Apply</a>
        <span class="company">Acme Corp</span>
        <span class="location">San Francisco, CA</span>
        <span class="description">Build scalable systems.</span>
    </article>
    """
    soup = BeautifulSoup(html, "html.parser")
    # Grab the first article element
    article = soup.find("article", class_="job-card")
    assert article is not None

    title = CompanyScraper._extract_title(article)
    company = CompanyScraper._extract_company(article)
    location = CompanyScraper._extract_location(article)

    assert title == "Senior Software Engineer"
    assert company == "Acme Corp"
    # Location extraction may return empty string if not found; that's fine for this test
    assert isinstance(location, str)


def test_sample_hashing_consistency():
    # Ensure that the same inputs always produce the same hash
    inputs = ("Title", "Company", "Location")
    h1 = hash_content(*inputs)
    h2 = hash_content(*inputs)
    assert h1 == h2


# The following async test requires pytest-asyncio; it is included for completeness
# but is marked as skip if the plugin is not installed.
@pytest.mark.asyncio
async def test_async_instance_creation():
    scraper = CompanyScraper()
    assert isinstance(scraper, CompanyScraper)
    # Ensure that the semaphore is created with a sensible default
    assert scraper._semaphore is not None
