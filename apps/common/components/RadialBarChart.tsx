import React, {useLayoutEffect} from 'react';
import Link from 'next/link';
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import LogoYearn from '@common/icons/LogoYearn';

export type TRadialChart = {
	data: {
		category: string,
		value: number
	}[];
	itemData: {
		text: string,
		description: string
		price: number
		percentage: number
	}[];
}

function RadialChart ({data, itemData}: TRadialChart): JSX.Element {
	useLayoutEffect((): () => void => {
		const root = am5.Root.new('chartdiv');

		const myTheme = am5.Theme.new(root);

		myTheme.rule('Label').setAll({
			fill: am5.color('#fff'),
			fontSize: '0.7em'
		});

		root.setThemes([am5themes_Animated.new(root), myTheme]);

		const chart = root.container.children.push(
			am5radar.RadarChart.new(root, {
				panX: false,
				panY: false,
				wheelX: 'panX',
				wheelY: 'zoomX',
				innerRadius: am5.percent(20),
				startAngle: -90,
				endAngle: 180
			})
		);
		const dataSetting = data.map((item: any, index: number): any => {
			return ({
				...item,
				full: 100,
				columnSettings: {
					fill: chart.get('colors')?.getIndex(index)
				}
			});
		});

		const cursor = chart.set('cursor', am5radar.RadarCursor.new(root, {
			behavior: 'zoomX'
		}));

		cursor.lineY.set('visible', false);

		const xRenderer = am5radar.AxisRendererCircular.new(root, {});

		xRenderer.labels.template.setAll({
			radius: 10
		});

		xRenderer.grid.template.setAll({
			forceHidden: true
		});

		const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			renderer: xRenderer,
			min: 0,
			max: 100,
			strictMinMax: true,
			numberFormat: "#'%'",
			tooltip: am5.Tooltip.new(root, {
			})
		}));

		const yRenderer = am5radar.AxisRendererRadial.new(root, {
			minGridDistance: 20
		});

		yRenderer.labels.template.setAll({
			centerX: am5.p100,
			fontWeight: '500',
			fontSize: 14,
			fontFamily: 'Aeonik, sans-serif',
			templateField: 'columnSettings'
		});

		yRenderer.grid.template.setAll({
			forceHidden: true
		});

		const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: 'category',
			renderer: yRenderer
		}));

		const series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			clustered: false,
			valueXField: 'full',
			categoryYField: 'category'
		}));

		series1.columns.template.setAll({
			width: am5.p100,
			fillOpacity: 0.08,
			strokeOpacity: 0,
			cornerRadius: 20
		});

		// series1.data.setAll(dataSetting);

		const series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			clustered: false,
			valueXField: 'value',
			categoryYField: 'category'
		}));

		series2.columns.template.setAll({
			width: am5.p100,
			strokeOpacity: 0,
			tooltipText: '{category}: {valueX}%',
			cornerRadius: 20,
			templateField: 'columnSettings'
		});

		series1.appear(1000);
		series2.appear(1000);
		chart.appear(1000, 100);

		yAxis.data.setAll(dataSetting);
		series1.data.setAll(dataSetting);
		series2.data.setAll(dataSetting);

		return (): void => {
			root.dispose();
		};
	}, [data]);


	return (
		<div className={'inline-block w-full rounded-md border border-white/10 p-3.5'}>
			<div className={'text-lg'}>{'Leading Companies'}</div>
			<div className={'text-sm'}>{'8k social visitors'}</div>
			<div className={'my-5 flex items-center gap-3'}>
				<div className={'text-gray-500 cursor-pointer rounded-sm bg-neutral-300 px-4 py-2 text-sm'}>{'2023'}</div>
				<div className={'text-gray-500 cursor-pointer px-4 py-2 text-sm'}>{'Mouth'}</div>
			</div>
			<div id={'chartdiv'} style={{height: 300, width: '100%'}}></div>

			<div className={'mt-2.5 flex flex-col gap-3'}>
				{
					itemData.map((item, index): JSX.Element => {
						return (
							<div
								key={index}
								className={'flex items-center justify-between gap-2.5 border-b border-dashed border-b-neutral-600 pb-3 last:border-none'}>
								<div className={'flex items-center gap-2.5'}>
									<LogoYearn
										className={'h-[30px] w-[30px]'}
										back={'text-neutral-900'}
										front={'text-neutral-0'} />
									<div>
										<Link href={'/'} className={''}>{item.text}</Link>
										<div className={'text-sm text-neutral-500'}>{item.description}</div>
									</div>
								</div>
								<div className={'flex items-center gap-2.5'}>
									<div className={'font-bold'}>{item.price}</div>
									<div className={'rounded-md bg-green-600/90 px-2'}>
										<span className={'text-sm'}>{`${item.percentage}%`}</span>
									</div>
								</div>
							</div>
						);
					})
				}
			</div>
		</div>
	);
}

export default RadialChart;
