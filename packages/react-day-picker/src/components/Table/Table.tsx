import React from 'react';

import { Footer } from 'components/Footer';
import { Head } from 'components/Head';
import { Row } from 'components/Row';
import { useDayPicker } from 'contexts/DayPicker';

import { getMonthWeeks } from './utils/getMonthWeeks';
import { AnimatePresence, motion } from 'framer-motion';

/** The props for the {@link Table} component. */
export interface TableProps {
  /** The ID of the label of the table (the same given to the Caption). */
  ['aria-labelledby']?: string;
  /** The month where the table is displayed. */
  displayMonth: Date;
}

/** Render the table with the calendar. */
export function Table(props: TableProps): JSX.Element {
  const {
    locale,
    classNames,
    styles,
    hideHead,
    fixedWeeks,
    components,
    weekStartsOn,
    firstWeekContainsDate,
    ISOWeek
  } = useDayPicker();

  const weeks = getMonthWeeks(props.displayMonth, {
    useFixedWeeks: Boolean(fixedWeeks),
    ISOWeek,
    locale,
    weekStartsOn,
    firstWeekContainsDate
  });

  const HeadComponent = components?.Head ?? Head;
  const RowComponent = components?.Row ?? Row;
  const FooterComponent = components?.Footer ?? Footer;

  const variants = {
    initial: { opacity: 0, x: '20%' },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 250,
        mass: 0.5,
        opacity: {
          duration: 0.3
        }
      }
    }
  };

  return (
    <table
      className={classNames.table}
      style={styles.table}
      role="grid"
      aria-labelledby={props['aria-labelledby']}
    >
      {!hideHead && <HeadComponent />}
      <tbody className={classNames.tbody} style={styles.tbody} role="rowgroup">
        <AnimatePresence initial={false}>
          {weeks.map((week) => (
            <motion.tr
              key={`${week.weekNumber} ${props.displayMonth}`}
              className={classNames.row}
              style={styles.row}
              variants={variants}
              initial="initial"
              animate="animate"
            >
              <RowComponent
                displayMonth={props.displayMonth}
                dates={week.dates}
                weekNumber={week.weekNumber}
              />
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
      <FooterComponent displayMonth={props.displayMonth} />
    </table>
  );
}
