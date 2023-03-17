import React, {useLayoutEffect} from 'react';
import am5geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';

import type {GeoJSON} from 'geojson';

type TGenderData = {
	age: string,
	male: number,
	female: number
	malePercent?: number
	femalePercent?: number
}

export type TPyramidAndMap = {
	usData: TGenderData[];
	stateData: {[state: string]: TGenderData[]};
}

function PyramidAndMap ({usData, stateData}: TPyramidAndMap): JSX.Element {
	const id = Math.random();


	const aggregateData = (list: TGenderData[]): TGenderData[] => {
		let maleTotal = 0;
		let femaleTotal = 0;


		list.map((row: TGenderData): void => {
			maleTotal += row.male;
			femaleTotal += row.female;
		});

		list.map((row: TGenderData): void => {
			row.malePercent = -1 * Math.round((row.male / maleTotal) * 10000) / 100;
			row.femalePercent = Math.round((row.female / femaleTotal) * 10000) / 100;
		});

		return list;
	};

	const data = aggregateData(usData);

	useLayoutEffect((): () => void => {
		const root = am5.Root.new(`chartmapdiv${id}`);

		const myTheme = am5.Theme.new(root);

		myTheme.rule('Label').setAll({
			fill: am5.color('#fff'),
			fontSize: '0.7em'
		});

		root.setThemes([am5themes_Animated.new(root), myTheme]);

		const container = root.container.children.push(am5.Container.new(root, {
			layout: root.horizontalLayout,
			width: am5.p100,
			height: am5.p100
		}));

		root.numberFormatter.setAll({
			numberFormat: '#.##as'
		});

		const chart = container.children.push(am5xy.XYChart.new(root, {
			panX: false,
			panY: false,
			wheelX: 'none',
			wheelY: 'none',
			layout: root.verticalLayout,
			width: am5.percent(60)
		}));

		const yAxis1 = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: 'age',
			renderer: am5xy.AxisRendererY.new(root, {})
		}));
		yAxis1.get('renderer').labels.template.set('fontSize', 12);
		yAxis1.data.setAll(data);

		const yAxis2 = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: 'age',
			renderer: am5xy.AxisRendererY.new(root, {
				opposite: true
			})
		}));
		yAxis2.get('renderer').labels.template.set('fontSize', 12);
		yAxis2.data.setAll(data);

		const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
			min: -10,
			max: 10,
			numberFormat: "#.s'%'",
			renderer: am5xy.AxisRendererX.new(root, {
				minGridDistance: 40
			})
		}));

		const maleSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
			name: 'Males',
			xAxis: xAxis,
			yAxis: yAxis1,
			valueXField: 'malePercent',
			categoryYField: 'age',
			clustered: false
		}));

		maleSeries.columns.template.setAll({
			tooltipText: "Males, age {categoryY}: {male} ({malePercent.formatNumber('#.0s')}%)",
			tooltipX: am5.p100
		});

		maleSeries.data.setAll(data);

		const femaleSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
			name: 'Males',
			xAxis: xAxis,
			yAxis: yAxis1,
			valueXField: 'femalePercent',
			categoryYField: 'age',
			clustered: false
		}));

		femaleSeries.columns.template.setAll({
			tooltipText: "Males, age {categoryY}: {female} ({femalePercent.formatNumber('#.0s')}%)",
			tooltipX: am5.p100
		});

		femaleSeries.data.setAll(data);

		const map = container.children.push(
			am5map.MapChart.new(root, {
				panX: 'none',
				panY: 'none',
				wheelY: 'none',
				projection: am5map.geoAlbersUsa(),
				width: am5.percent(40)
			})
		);

		chart.getTooltip()?.set('autoTextColor', false);

		const title = map.children.push(am5.Label.new(root, {
			text: 'United States',
			fontSize: 20,
			y: 20,
			x: am5.p50,
			centerX: am5.p50,
			background: am5.Rectangle.new(root, {
				fill: am5.color(0xffffff),
				fillOpacity: 0.5
			})
		}));

		const polygonSeries = map.series.push(
			am5map.MapPolygonSeries.new(root, {
				fill: am5.color(0x999999),
				geoJSON: am5geodata_usaLow as GeoJSON
			})
		);

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: '{name}',
			interactive: true
		});

		polygonSeries.mapPolygons.template.states.create('hover', {
			fill: chart.get('colors')?.getIndex(2)
		});

		polygonSeries.mapPolygons.template.states.create('active', {
			fill: chart.get('colors')?.getIndex(3)
		});

		let activePolygon: am5.Sprite & am5map.MapPolygon;
		polygonSeries.mapPolygons.template.events.on('click', (ev): void => {
			if (activePolygon) {
				activePolygon.set('active', false);
			}
			activePolygon = ev.target;
			activePolygon.set('active', true);
			const dataItem = ev?.target?.dataItem?.dataContext as any;
			const state = dataItem.id?.split('-')?.pop();
			const data = aggregateData(stateData?.[state]);

			for(let i = 0; i < data.length; i++){
				maleSeries.data.setIndex(i, data[i]);
				femaleSeries.data.setIndex(i, data[i]);
			}


			title.set('text', dataItem.name);
		});

		return (): void => {
			root.dispose();
		};
	}, [data, id, stateData]);

	return (
		<div className={'flex h-full flex-col justify-center rounded-md border border-white/10 p-3.5'}>
			<div className={'mb-3'}>
				<div className={'text-lg'}>{'Human Resources'}</div>
				<div className={'text-sm'}>{'Reports by states and ganders'}</div>
			</div>

			<div className={'overflow-x-auto pb-6'}>
				<div
					id={`chartmapdiv${id}`}
					style={{height: 450, width: 800}}
					className={'m-auto'}>
				</div>
			</div>
		</div>
	);
}

export default PyramidAndMap;
