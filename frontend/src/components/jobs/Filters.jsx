import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SegmentedControl from '../ui/SegmentedControl';
import { springPresets } from '../../utils/appleDesign';

/**
 * Filters — collapsible advanced filters.
 * Uses native inputs styled per the design system. Per §1, focus states are instant.
 */
const REMOTE_OPTS = [
  { value: 'any', label: 'Any' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
];

const EXP_LEVELS = ['Any', 'Intern', 'Fresher', 'Entry', 'Mid', 'Senior'];
const POSTED = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24h' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last week' },
  { value: '14', label: 'Last 2 weeks' },
  { value: '30', label: 'Last month' },
];

const EMP_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary'];
const SOURCES = ['jsearch', 'adzuna', 'remotive', 'remoteok', 'arbeitnow'];

export default function Filters({ filters, onChange }) {
  const [open, setOpen] = useState(false);
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-secondary btn-sm"
        style={{ width: '100%', justifyContent: 'center' }}
        aria-expanded={open}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
      >
        {open ? 'Hide filters' : 'Show filters'}
        <span style={{ fontSize: '0.7rem', marginLeft: 4 }}>{open ? '▴' : '▾'}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springPresets.gentle}
            style={{ overflow: 'hidden' }}
          >
            <div className="glass-card" style={{
              borderRadius: 'var(--r-3)',
              padding: 'var(--space-5)',
              marginTop: 'var(--space-3)',
              display: 'grid',
              gap: 'var(--space-5)',
            }}>
              {/* Source */}
              <FilterRow label="Source">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {SOURCES.map((src) => {
                    const active = (filters.sources || []).includes(src);
                    return (
                      <motion.button
                        key={src}
                        onClick={() => {
                          const list = filters.sources || [];
                          set({ sources: active ? list.filter((s) => s !== src) : [...list, src] });
                        }}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textTransform: 'capitalize' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                      >
                        {src}
                      </motion.button>
                    );
                  })}
                </div>
              </FilterRow>

              {/* Employment type */}
              <FilterRow label="Employment type">
                <SegmentedControl
                  options={[{ value: '', label: 'Any' }, ...EMP_TYPES.map((t) => ({ value: t, label: t }))]}
                  value={filters.employment_type || ''}
                  onChange={(v) => set({ employment_type: v })}
                  ariaLabel="Employment type"
                />
              </FilterRow>

              {/* Remote */}
              <FilterRow label="Work mode">
                <SegmentedControl
                  options={REMOTE_OPTS}
                  value={filters.remote || 'any'}
                  onChange={(v) => set({ remote: v })}
                  ariaLabel="Work mode"
                />
              </FilterRow>

              {/* Experience level */}
              <FilterRow label="Experience">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {EXP_LEVELS.map((lvl) => {
                    const active = (filters.experience_level || 'Any') === lvl;
                    return (
                      <motion.button
                        key={lvl}
                        onClick={() => set({ experience_level: lvl === 'Any' ? '' : lvl })}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                      >
                        {lvl}
                      </motion.button>
                    );
                  })}
                </div>
              </FilterRow>

              {/* Posted within */}
              <FilterRow label="Posted within" stacked>
                <select
                  className="input select"
                  value={filters.posted_within_days || ''}
                  onChange={(e) => set({ posted_within_days: e.target.value })}
                  style={{ height: 44 }}
                >
                  {POSTED.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </FilterRow>

              {/* Salary range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <FilterRow label="Min salary (₹/yr)" stacked>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="50000"
                    value={filters.salary_min || ''}
                    onChange={(e) => set({ salary_min: e.target.value })}
                    placeholder="e.g. 300000"
                    style={{ height: 44 }}
                  />
                </FilterRow>
                <FilterRow label="Max salary (₹/yr)" stacked>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="50000"
                    value={filters.salary_max || ''}
                    onChange={(e) => set({ salary_max: e.target.value })}
                    placeholder="e.g. 1200000"
                    style={{ height: 44 }}
                  />
                </FilterRow>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterRow({ label, children, stacked = false }) {
  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-4)',
    flexWrap: 'wrap',
  };
  if (stacked) {
    rowStyle.display = 'block';
    rowStyle.flexDirection = 'column';
    rowStyle.alignItems = 'stretch';
    rowStyle.gap = 'var(--space-2)';
  }
  return (
    <div style={rowStyle}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}