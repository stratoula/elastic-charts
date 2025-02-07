/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { computeSeriesDomainsSelector } from './compute_series_domains';
import { isHistogramModeEnabledSelector } from './is_histogram_mode_enabled';
import { SeriesType } from '../../../../specs';
import { createCustomCachedSelector } from '../../../../state/create_selector';
import { groupBy } from '../../utils/group_data_series';
import { SeriesDomainsAndData } from '../utils/types';
import { getBarIndexKey } from '../utils/utils';

/** @internal */
export const countBarsInClusterSelector = createCustomCachedSelector(
  [computeSeriesDomainsSelector, isHistogramModeEnabledSelector],
  countBarsInCluster,
);

/** @internal */
export function countBarsInCluster({ formattedDataSeries }: SeriesDomainsAndData, isHistogramEnabled: boolean): number {
  const barDataSeries = formattedDataSeries.filter(({ seriesType }) => seriesType === SeriesType.Bar);

  const dataSeriesGroupedByPanel = groupBy(
    barDataSeries,
    ['smVerticalAccessorValue', 'smHorizontalAccessorValue'],
    false,
  );

  const barIndexByPanel = Object.keys(dataSeriesGroupedByPanel).reduce<Record<string, string[]>>((acc, panelKey) => {
    const panelBars = dataSeriesGroupedByPanel[panelKey];
    const barDataSeriesByBarIndex = groupBy(
      panelBars,
      (d) => {
        return getBarIndexKey(d, isHistogramEnabled);
      },
      false,
    );

    acc[panelKey] = Object.keys(barDataSeriesByBarIndex);
    return acc;
  }, {});

  return Object.values(barIndexByPanel).reduce((acc, curr) => {
    return Math.max(acc, curr.length);
  }, 0);
}
