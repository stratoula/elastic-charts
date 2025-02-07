/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { select } from '@storybook/addon-knobs';
import React from 'react';

import {
  AnnotationDomainType,
  LineAnnotationDatum,
  Chart,
  LineAnnotation,
  BarSeries,
  ScaleType,
  Position,
  Settings,
} from '@elastic/charts';

import { useBaseTheme } from '../../use_base_theme';
import { getChartRotationKnob } from '../utils/knobs';

function generateAnnotationData(values: any[]): LineAnnotationDatum[] {
  return values.map((value, index) => ({ dataValue: value, details: `detail-${index}` }));
}

export const Example = () => {
  const markerPositionHorizontal = select(
    'horizontal marker position',
    [Position.Top, Position.Left, Position.Bottom, Position.Right, 'undefined'],
    'undefined',
  );
  const markerPositionVertical = select(
    'vertical marker position',
    [Position.Top, Position.Left, Position.Bottom, Position.Right, 'undefined'],
    'undefined',
  );
  const chartRotation = getChartRotationKnob();
  return (
    <Chart>
      <Settings rotation={chartRotation} baseTheme={useBaseTheme()} />
      <LineAnnotation
        domainType={AnnotationDomainType.XDomain}
        id="ann"
        dataValues={[{ dataValue: 'bags' }]}
        marker={<div style={{ background: 'red' }}>Vertical</div>}
        markerPosition={markerPositionVertical === 'undefined' ? undefined : markerPositionVertical}
      />
      <LineAnnotation
        domainType={AnnotationDomainType.YDomain}
        id="ann1"
        dataValues={generateAnnotationData([30])}
        marker={<div style={{ background: 'yellow' }}>Horizontal</div>}
        markerPosition={markerPositionHorizontal === 'undefined' ? undefined : markerPositionHorizontal}
      />
      <BarSeries
        id="bars"
        name="amount"
        xScaleType={ScaleType.Ordinal}
        xAccessor="x"
        yAccessors={['y']}
        data={[
          { x: 'trousers', y: 390, val: 1222 },
          { x: 'watches', y: 23, val: 1222 },
          { x: 'bags', y: 750, val: 1222 },
          { x: 'cocktail dresses', y: 854, val: 1222 },
        ]}
      />
    </Chart>
  );
};
