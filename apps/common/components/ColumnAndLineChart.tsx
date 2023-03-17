import React, {useLayoutEffect} from 'react';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';

import type {Bullet} from '@amcharts/amcharts5';

export type TColumnAndLineChart = {
	data: any
}

function ColumnAndLineChart({data}: TColumnAndLineChart): JSX.Element {
	const id = Math.random();
	useLayoutEffect((): () => void => {
		const root = am5.Root.new(`barchart${id}`);

		const myTheme = am5.Theme.new(root);

		myTheme.rule('Label').setAll({
			fill: am5.color('#fff'),
			fontSize: '0.7em'
		});

		root.setThemes([am5themes_Animated.new(root), myTheme]);

		const chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panX: false,
				panY: false,
				wheelX: 'panX',
				wheelY: 'zoomX',
				layout: root.verticalLayout
			})
		);

		const xRenderer = am5xy.AxisRendererX.new(root, {});
		const xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				categoryField: 'year',
				renderer: xRenderer,
				tooltip: am5.Tooltip.new(root, {})
			})
		);
		xRenderer.grid.template.setAll({
			location: 1
		});

		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				min: 0,
				extraMax: 0.1,
				renderer: am5xy.AxisRendererY.new(root, {
					strokeOpacity: 0.1
				})
			})
		);

		const series1 = chart.series.push(
			am5xy.ColumnSeries.new(root, {
				name: 'Income',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'income',
				categoryXField: 'year',
				tooltip: am5.Tooltip.new(root, {
					labelText: '{name} in {categoryX}: {valueY} {info}'
				})
			})
		);

		series1.columns.template.setAll({
			tooltipY: am5.percent(10),
			templateField: 'columnSettings'
		});


		const series2 = chart.series.push(
			am5xy.LineSeries.new(root, {
				name: 'Expenses',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'expenses',
				categoryXField: 'year',
				tooltip: am5.Tooltip.new(root, {
					labelText: '{name} in {categoryX}: {valueY} {info}'
				})
			})
		);

		series2.strokes.template.setAll({
			strokeWidth: 3,
			templateField: 'strokeSettings'
		});

		series2.bullets.push((): Bullet => {
			return am5.Bullet.new(root, {
				sprite: am5.Circle.new(root, {
					strokeWidth: 3,
					stroke: series2.get('stroke'),
					radius: 5,
					fill: root.interfaceColors.get('background')
				})
			});
		});

		chart.set('cursor', am5xy.XYCursor.new(root, {}));

		const legend = chart.children.push(
			am5.Legend.new(root, {
				centerX: am5.p50,
				x: am5.p50
			})
		);
		legend.data.setAll(chart.series.values);

		chart.appear(1000, 100);
		series1.appear();
		series1.data.setAll(data);
		series2.data.setAll(data);
		xAxis.data.setAll(data);

		return (): void => {
			root.dispose();
		};
	}, [data, id]);

	return (
		<div className={'flex flex-col justify-center rounded-md border border-white/10 p-3.5'}>
			<div className={'mb-3'}>
				<div className={'text-lg'}>{'Some Chart with AmCharts'}</div>
				<div className={'text-sm'}>{'83 countries in service'}</div>
			</div>
			<div id={`barchart${id}`} style={{height: 300, width: '100%'}}></div>
		</div>
	);
}

export default ColumnAndLineChart;
