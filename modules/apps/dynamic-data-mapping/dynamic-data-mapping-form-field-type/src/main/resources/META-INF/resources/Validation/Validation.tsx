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

import React from 'react';

import ValidationDate from './ValidationDate';
import ValidationDefault from './ValidationDefault';

type Components = {
	[key: string]: React.FC<React.HTMLAttributes<HTMLElement> & any>;
};

const Components: Components = {
	date: ValidationDate,
	numeric: ValidationDefault,
	string: ValidationDefault,
};

interface IValidationProps extends React.HTMLAttributes<HTMLElement> {
	dataType: string;
}

const Validation: React.FC<IValidationProps> = (props) => {
	const Component = Components[props.dataType];

	return <Component {...props} />;
};

export default Validation;
