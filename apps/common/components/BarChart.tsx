import React, {useLayoutEffect} from 'react';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';

export type TBarChart = {
	data: {
		country: string,
		value: number
	}[]
}

function BarChart({data}: TBarChart): JSX.Element {
	const id = Math.random();
	useLayoutEffect((): () => void => {
		const root = am5.Root.new(`barchart${id}`);

		const myTheme = am5.Theme.new(root);

		myTheme.rule('Label').setAll({
			fill: am5.color('#fff'),
			fontSize: '0.7em'
		});

		root.setThemes([am5themes_Animated.new(root), myTheme]);

		const chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: false,
			panY: false
		}));

		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));

		cursor.lineY.set('visible', false);
		cursor.lineX.set('visible', false);

		const xRenderer = am5xy.AxisRendererX.new(root, {minGridDistance: 30});
		xRenderer.labels.template.setAll({
			rotation: -90,
			centerY: am5.p50,
			centerX: am5.p100,
			paddingRight: 15
		});

		xRenderer.grid.template.setAll({
			location: 1
		});


		const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			maxDeviation: 0.3,
			categoryField: 'country',
			renderer: xRenderer
		}));

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			maxDeviation: 0.3,
			renderer: am5xy.AxisRendererY.new(root, {
				strokeOpacity: 0.1
			})
		}));

		const series = chart.series.push(am5xy.ColumnSeries.new(root, {
			name: 'Series 1',
			xAxis: xAxis,
			yAxis: yAxis,
			valueYField: 'value',
			sequencedInterpolation: true,
			categoryXField: 'country',
			tooltip: am5.Tooltip.new(root, {
				labelText: '{valueY}'
			})
		}));

		series.columns.template.setAll({cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0});
		series.columns.template.adapters.add('fill', (_, target): any => {
			return chart.get('colors')?.getIndex(series.columns.indexOf(target));
		});

		series.columns.template.adapters.add('stroke', (_, target): any => {
			return chart.get('colors')?.getIndex(series.columns.indexOf(target));
		});


		series.appear(1000);
		chart.appear(1000, 100);

		xAxis.data.setAll(data);
		series.data.setAll(data);

		return (): void => {
			root.dispose();
		};
	}, [data, id]);

	return (
		<div className={'flex flex-col justify-center rounded-md border border-white/10 p-3.5'}>
			<div className={'mb-3'}>
				<div className={'text-lg'}>{'LOI Issued by Departments'}</div>
				<div className={'text-sm'}>{'Counted in Millions'}</div>
			</div>
			<div id={`barchart${id}`} style={{height: 300, width: '100%'}}></div>
		</div>
	);
}

export default BarChart;
