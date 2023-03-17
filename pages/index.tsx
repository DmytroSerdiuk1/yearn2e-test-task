import React, {useRef} from 'react';
import Balancer from 'react-wrap-balancer';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useClientEffect} from '@yearn-finance/web-lib/hooks/useClientEffect';
import {YCRV_TOKEN_ADDRESS} from '@yearn-finance/web-lib/utils/constants';
import DashboardCard from '@common/components/DashboadCard';
import LogoYearn from '@common/icons/LogoYearn';
import {AreaChartData, AreaChartItemData,
	AreaRadarChartData,
	BarChartData,
	ColumnLineData,
	RadialBarChartData, RadialBarChartItemData,
	stateData,
	usData} from '@common/mock/MockData';

import type {LoaderComponent} from 'next/dynamic';
import type {ReactElement} from 'react';
import type {TAreaChart} from '@common/components/AreaChart';
import type {TAreaRadarChart} from '@common/components/AreaRadarChart';
import type {TBarChart} from '@common/components/BarChart';
import type {TColumnAndLineChart} from '@common/components/ColumnAndLineChart';
import type {TPyramidAndMap} from '@common/components/PyramidAndMap';
import type {TRadialChart} from '@common/components/RadialBarChart';

const RadialBarChart = dynamic<TRadialChart>(async (): LoaderComponent<TRadialChart> => import('@common/components/RadialBarChart'), {ssr: false});
const BarChart = dynamic<TBarChart>(async (): LoaderComponent<TBarChart> => import('@common/components/BarChart'), {ssr: false});
const AreaChart = dynamic<TAreaChart>(async (): LoaderComponent<TAreaChart> => import('@common/components/AreaChart'), {ssr: false});
const ColumnAndLineChart = dynamic<TColumnAndLineChart>(async (): LoaderComponent<TColumnAndLineChart> => import('@common/components/ColumnAndLineChart'), {ssr: false});
const PyramidAndMap = dynamic<TPyramidAndMap>(async (): LoaderComponent<TPyramidAndMap> => import('@common/components/PyramidAndMap'), {ssr: false});
const AreaRadarChart = dynamic<TAreaRadarChart>(async (): LoaderComponent<TAreaRadarChart> => import('@common/components/AreaRadarChart'), {ssr: false});

const financePerformance = [
	{
		label: 'Total Value Locked',
		value: 300000,
		percentage: 5,
		fallen: true,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	},
	{
		label: 'Total Locked',
		value: 3030000,
		percentage: 4,
		fallen: false,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	},
	{
		label: 'Total Value Locked',
		value: 300000,
		percentage: 2,
		fallen: false,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	},
	{
		label: 'Total Value Locked',
		value: 300000,
		percentage: 1,
		fallen: false,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	},
	{
		label: 'Total Value Locked',
		value: 33300000,
		percentage: 3,
		fallen: false,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	},
	{
		label: 'Total Value Locked',
		value: 30044000,
		percentage: 2.2,
		fallen: false,
		icon: <LogoYearn
			className={'h-[30px] w-[30px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	}
];

const	apps = [
	{
		href: '/vaults',
		title: 'Vaults',
		description: 'deposit tokens and receive yield.',
		icon: <LogoYearn
			className={'h-[100px] w-[100px]'}
			back={'text-pink-400'}
			front={'text-white'} />
	}, {
		href: '/ycrv',
		title: 'yCRV',
		description: 'get the best CRV yields in DeFi.',
		icon: <Image
			alt={'yCRV'}
			width={100}
			height={100}
			src={`${process.env.BASE_YEARN_ASSETS_URI}/1/${YCRV_TOKEN_ADDRESS}/logo-128.png`}
			loading={'eager'}
			priority />
	}, {
		href: '/veyfi',
		title: 'veYFI',
		description: 'lock YFI\nto take part in governance.',
		icon: <LogoYearn
			className={'h-[100px] w-[100px]'}
			back={'text-primary'}
			front={'text-white'} />
	}, {
		href: '/ybribe',
		title: 'yBribe',
		description: 'sell votes, or buy them.\njust like democracy.',
		icon: <LogoYearn
			className={'h-[100px] w-[100px]'}
			back={'text-neutral-900'}
			front={'text-neutral-0'} />
	}
];

function	AppBox({app}: {app: typeof apps[0]}): ReactElement {
	useClientEffect((): VoidFunction => {
		const featuresEl = document.getElementById(app.href);
		if (featuresEl) {
			const	cleanup = (): void => {
				featuresEl.removeEventListener('pointermove', pointermove);
				featuresEl.removeEventListener('pointerleave', pointerleave);
			};

			const	pointermove = (ev: MouseEvent): void => {
				const rect = featuresEl.getBoundingClientRect();
				if (featuresEl?.style) {
					featuresEl.style.setProperty('--opacity', '0.3');
					featuresEl.style.setProperty('--x', (ev.clientX - rect.left).toString());
					featuresEl.style.setProperty('--y', (ev.clientY - rect.top).toString());
				}
			};

			const	pointerleave = (): void => {
				if (featuresEl?.style) {
					featuresEl.style.setProperty('--opacity', '0');
				}
			};

			featuresEl.addEventListener('pointermove', pointermove);
			featuresEl.addEventListener('pointerleave', pointerleave);
			return cleanup;
		}
		return (): void => undefined;
	}, []);

	return (
		<Link
			prefetch={false}
			key={app.href}
			href={app.href}>
			<div id={app.href} className={'appBox'}>
				<div>
					{app.icon}
				</div>
				<div className={'pt-6 text-center'}>
					<b className={'text-lg'}>{app.title}</b>
					<p><Balancer>{app.description}</Balancer></p>
				</div>
			</div>
		</Link>
	);
}

function	TextAnimation(): ReactElement {
	const hasBeenTriggerd = useRef<boolean>(false);

	function	onStartAnimation(): void {
		hasBeenTriggerd.current = true;
		const words = document.getElementsByClassName('word') as HTMLCollectionOf<HTMLSpanElement>;
		const wordArray: HTMLSpanElement[][] = [];
		let currentWord = 0;

		words[currentWord].style.opacity = '1';
		for (const word of Array.from(words)) {
			splitLetters(word);
		}

		function changeWord(): void {
			const cw = wordArray[currentWord];
			const nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
			if (!cw || !nw) {
				return;
			}
			for (let i = 0; i < cw.length; i++) {
				animateLetterOut(cw, i);
			}

			for (let i = 0; i < nw.length; i++) {
				nw[i].className = 'letter behind';
				if (nw?.[0]?.parentElement?.style) {
					nw[0].parentElement.style.opacity = '1';
				}
				animateLetterIn(nw, i);
			}
			currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
		}

		function animateLetterOut(cw: HTMLSpanElement[], i: number): void {
			setTimeout((): void => {
				cw[i].className = 'letter out';
			}, i*80);
		}

		function animateLetterIn(nw: HTMLSpanElement[], i: number): void {
			setTimeout((): void => {
				nw[i].className = 'letter in';
			}, 340+(i*80));
		}

		function splitLetters(word: HTMLSpanElement): void {
			const content = word.innerHTML;
			word.innerHTML = '';
			const letters = [];
			for (let i = 0; i < content.length; i++) {
				const letter = document.createElement('span');
				letter.className = 'letter';
				letter.innerHTML = content.charAt(i);
				word.appendChild(letter);
				letters.push(letter);
			}

			wordArray.push(letters);
		}

		setTimeout((): void => {
			changeWord();
			setInterval(changeWord, 3000);
		}, 3000);
	}

	useClientEffect((): void => {
		if (!hasBeenTriggerd.current) {
			onStartAnimation();
		}
	}, [hasBeenTriggerd.current]);

	return (
		<>
			<div className={'text'}>
				<p className={'wordWrapper'}>
					<span className={'word'}>{'STAKE'}</span>
					<span className={'word'}>{'INVEST'}</span>
					<span className={'word'}>{'BUILD'}</span>
					<span className={'word'}>{'CHILL'}</span>
					<span className={'word'}>{'LOCK'}</span>
					<span className={'word'}>{'EARN'}</span>
					<span className={'word'}>{'APE'}</span>
				</p>
			</div>
		</>
	);
}

function	Index(): ReactElement {

	return (
		<>
			<div className={'mx-auto mt-6 mb-10 flex flex-col justify-center md:mt-20 md:mb-14'}>
				<div className={'relative h-12 w-[300px] self-center md:h-[104px] md:w-[600px]'}>
					<TextAnimation />
				</div>
				<div className={'my-8'}>
					<p className={'text-center text-lg md:text-2xl'}>
						{'With '}
						<b>{'Yearn'}</b>
						{'. The Yield Protocol.'}
					</p>
				</div>
				<div className={'mb-6'}>

					<p className={'text-center text-sm text-neutral-500 md:text-base'}>
						<Balancer>{'Yearn is a decentralized suite of products helping individuals, DAOs, and other protocols\nearn yield on their digital assets.'}</Balancer>
					</p>
				</div>
			</div>
			<section className={'grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4'}>
				{apps.map((app): ReactElement => <AppBox key={app.href} app={app} />)}
			</section>

			<div className={'mt-10 pb-5'}>
				{'Finance Performance'}
			</div>
			<div className={'mb-16 flex justify-between gap-2.5 overflow-x-auto pb-3 sm:flex-wrap lg:flex-nowrap'}>
				{financePerformance.map((item): JSX.Element => {
					return (<DashboardCard
						key={item.label}
						fallen={item.fallen}
						icon={item.icon}
						changePercentage={item.percentage}
						value={item.value}
						label={item.label}
					/>);
				})}
			</div>
			<div className={'mb-3.5 flex flex-wrap gap-3.5 lg:flex-nowrap'}>
				<div className={'w-full lg:w-5/12'}>
					<RadialBarChart itemData={RadialBarChartItemData} data={RadialBarChartData}/>
				</div>
				<div className={'flex w-full flex-col gap-3.5'}>
					<BarChart data={BarChartData}/>
					<AreaChart items={AreaChartItemData} data={AreaChartData()}/>
				</div>
			</div>
			<div className={'flex flex-wrap gap-3.5 lg:flex-nowrap'}>
				<div className={'w-full xl:w-5/12'}>
					<div className={'flex h-full flex-col justify-center rounded-md border border-white/10 p-3.5'}>
						<div className={'text-center text-2xl'}>
							<div>{'Try out our'}</div>
							{'new'}<span className={'font-bold'}>{' Invoice Manager'}</span>
						</div>
						<div className={'mt-4 flex justify-center gap-2'}>
							<Button>{'Try Now'}</Button>
							<Button variant={'outlined'}>{'Learn More'}</Button>
						</div>
					</div>
				</div>
				<div className={'flex w-full flex-col gap-3.5'}>
					<ColumnAndLineChart data={ColumnLineData}/>
				</div>
			</div>
			<div className={'mt-3.5 flex flex-wrap gap-3.5 lg:flex-nowrap'}>
				<div className={'w-full xl:w-5/12'}>
					<AreaRadarChart data={AreaRadarChartData}/>
				</div>
				<div className={'flex w-full flex-col gap-3.5'}>
					<PyramidAndMap usData={usData} stateData={stateData}/>
				</div>
			</div>
		</>
	);
}

export default Index;
