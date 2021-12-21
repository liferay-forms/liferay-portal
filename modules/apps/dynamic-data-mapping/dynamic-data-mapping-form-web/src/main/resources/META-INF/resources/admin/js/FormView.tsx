/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {FormView as DataEngineFormView} from 'data-engine-js-components-web';
import React from 'react';

import DefaultPageHeader from './components/DefaultPageHeader';

const FormView: React.FC<IProps> = ({description, title, ...otherProps}) => {
	return (
		<>
			<ClayButton
				className="hide lfr-de__partial-results-back-button"
				displayType="link"
			>
				<ClayIcon symbol="order-arrow-left" />

				{Liferay.Language.get('back')}
			</ClayButton>
			{title && (
				<DefaultPageHeader description={description} title={title} />
			)}
			<DataEngineFormView {...otherProps} />
		</>
	);
};

export default FormView;

interface IProps {
	description?: string;
	title?: string;
}
