import React, {useLayoutEffect} from 'react';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import {numberFormatter} from '@common/utils/numberFormater';

export type TAreaChart = {
	data: {
		date: Date,
		visits: number
	}[]
	items: {
		price: number
		label: string
	}[]
}

function AreaChart ({data, items}: TAreaChart): JSX.Element {
	useLayoutEffect((): () => void => {
		const root = am5.Root.new('areachartdiv');

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
				wheelY: 'none'
			})
		);

		const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			maxDeviation:1,
			renderer: am5xy.AxisRendererY.new(root, {})
		}));

		const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
			groupData: true,
			maxDeviation:0.5,
			baseInterval: {timeUnit: 'minute', count: 1},
			renderer: am5xy.AxisRendererX.new(root, {
			})
		}));

		const series = chart.series.push(am5xy.LineSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			valueYField: 'visits',
			valueXField: 'date',
			tooltip: am5.Tooltip.new(root, {
				pointerOrientation: 'horizontal',
				labelText: '[bold]{name}[/]\n{valueX.formatDate()}: {valueY}'
			})
		}));

		series.strokes.template.set('strokeWidth', 2);

		series.fills.template.setAll({
			visible: true,
			fillOpacity: 0.4
		});

		series.events.once('datavalidated', (): void => {
			const lastDate = new Date(data[data.length - 1].date);
			const firstDate = new Date(lastDate.getTime() - 3600000);
			xAxis.zoomToDates(firstDate, lastDate);
		});

		chart.set('cursor', am5xy.XYCursor.new(root, {
			behavior: 'none',
			xAxis: xAxis
		}));

		xAxis.set('tooltip', am5.Tooltip.new(root, {}));

		yAxis.set('tooltip', am5.Tooltip.new(root, {}));

		series.data.setAll(data);

		return (): void => {
			root.dispose();
		};
	}, [data]);

	return (
		<div className={'flex flex-col justify-center rounded-md border border-white/10 p-3.5'}>
			<div className={'mb-3'}>
				<div className={'text-lg'}>{'Monthly Targets'}</div>
				<div className={'my-2 flex gap-4 overflow-x-auto pb-3'}>
					{
						items?.map((item, key): JSX.Element => {
							return (
								<div key={key} className={'border-r pr-4 last:border-none'}>
									<div className={'flex'}>
										<span className={'mr-2 text-sm text-neutral-500'}>{'$'}</span>
										<div className={'text-3xl font-bold'}>{numberFormatter(item.price, 3)}</div>
									</div>
									<span className={'text-sm text-neutral-500'}>{item.label}</span>
								</div>
							);
						})
					}
				</div>
			</div>
			<div id={'areachartdiv'} style={{height: 300, width: '100%'}}></div>
		</div>
	);
}

export default AreaChart;
