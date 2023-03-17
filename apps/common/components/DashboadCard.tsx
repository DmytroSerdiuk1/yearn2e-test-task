import React from 'react';
import {numberFormatter} from '@common/utils/numberFormater';

import type {ReactElement} from 'react';

export type TDashboardCard = {
	value: number;
	label: string;
	icon?: JSX.Element;
	fallen: boolean;
	changePercentage: number;
}

function	DashboardCard({value, label, icon, changePercentage, fallen}: TDashboardCard): ReactElement {
	return (
		<div
			style={{
				minWidth: 160
			}}
			className={'inline-flex flex-col justify-between gap-3.5 rounded-xl border border-white/10 p-6 shadow-xl'}>
			<div className={'inline-flex flex-col gap-2'}>
				<div>{icon}</div>
				<div className={'inline-flex flex-col'}>
					<div className={'text-4xl font-bold'}>{numberFormatter(value, 1)}</div>
					<div className={'text-sm text-neutral-400'}>{label}</div>
				</div>
			</div>
			<div>
				<div className={`inline-block rounded-xl px-3 py-0.5 text-sm ${fallen ? 'bg-red-900/90' : 'bg-green-600/90'}`}>
					{changePercentage}{'%'}
				</div>
			</div>
		</div>
	);
}

export default DashboardCard;
