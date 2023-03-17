import React, {useLayoutEffect} from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';



export type TAreaRadarChart = {
	data: {
		name: string,
		value1: number,
		value2: number
	}[]
}
function AreaRadarChart ({data}: TAreaRadarChart): JSX.Element {
	const id = Math.random();
	useLayoutEffect((): () => void => {
		const root = am5.Root.new(`areachart${id}`);

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
				innerRadius: am5.percent(40),
				radius: am5.percent(70),
				arrangeTooltips: false
			})
		);

		const cursor = chart.set('cursor', am5radar.RadarCursor.new(root, {
			behavior: 'zoomX'
		}));

		cursor.lineY.set('visible', false);

		const xRenderer = am5radar.AxisRendererCircular.new(root, {
			minGridDistance: 30
		});

		xRenderer.labels.template.setAll({
			textType: 'radial',
			radius: 10,
			paddingTop: 0,
			paddingBottom: 0,
			centerY: am5.p50,
			fontSize: '0.8em'
		});

		xRenderer.grid.template.setAll({
			location: 0.5,
			strokeDasharray: [2, 2]
		});

		const xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				maxDeviation: 0,
				categoryField: 'name',
				renderer: xRenderer,
				tooltip: am5.Tooltip.new(root, {})
			})
		);

		const yRenderer = am5radar.AxisRendererRadial.new(root, {
			minGridDistance: 30
		});

		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				renderer: yRenderer
			})
		);

		yRenderer.grid.template.setAll({
			strokeDasharray: [2, 2]
		});

		// Create series
		const series1 = chart.series.push(
			am5radar.RadarLineSeries.new(root, {
				name: 'Cash held outside',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value1',
				categoryXField: 'name'
			})
		);

		series1.strokes.template.setAll({
			strokeOpacity: 0
		});

		series1.fills.template.setAll({
			visible: true,
			fillOpacity: 0.5
		});

		const series2 = chart.series.push(
			am5radar.RadarLineSeries.new(root, {
				name: 'Cash held in US',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value2',
				categoryXField: 'name',
				stacked: true,
				tooltip: am5.Tooltip.new(root, {
					labelText: 'Outside: {value1}\nInside:{value2}'
				})
			})
		);

		series2.strokes.template.setAll({
			strokeOpacity: 0
		});

		series2.fills.template.setAll({
			visible: true,
			fillOpacity: 0.5
		});

		const legend = chart.radarContainer.children.push(
			am5.Legend.new(root, {
				width: 150,
				centerX: am5.p50,
				centerY: am5.p50
			})
		);
		legend.data.setAll([series1, series2]);

		series1.data.setAll(data);
		series2.data.setAll(data);
		xAxis.data.setAll(data);

		series1.appear(1000);
		series2.appear(1000);
		chart.appear(1000, 100);
		return (): void => {
			root.dispose();
		};
	}, [data, id]);


	return (
		<div className={'flex flex-col justify-center rounded-md border border-white/10 p-3.5'}>
			<div className={'flex justify-between'}>
				<div className={'mb-3'}>
					<div className={'text-lg'}>{'Warephase stats'}</div>
					<div className={'text-sm'}>{'8k social visitors'}</div>
				</div>
				<div className={'my-1 flex items-center gap-3'}>
					<div className={'text-gray-500 cursor-pointer rounded-sm bg-neutral-300 px-4 py-2 text-sm'}>{'2023'}</div>
					<div className={'text-gray-500 cursor-pointer px-4 py-2 text-sm'}>{'Mouth'}</div>
				</div>
			</div>
			<div id={`areachart${id}`} style={{height: 450, width: '100%'}}></div>
		</div>
	);
}

export default AreaRadarChart;
