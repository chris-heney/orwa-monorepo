import * as React from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DefaultIcon from '@mui/icons-material/ViewList';
import { useResourceDefinitions, useTranslate, Translate } from 'react-admin';

import { IconMenu, IconMenuProps } from './IconMenu';

export const IconMenuResources = ({
    hasDashboard,
    ...props
}: IconMenuResourcesProps) => {
    const translate = useTranslate();
    const resources = useResourceDefinitions();

    return (
        <IconMenu {...props}>
            {hasDashboard && (
                <IconMenu.Item
                    name="dashboard"
                    to="/"
                    end
                    label="Dashboard"
                    icon={<DashboardIcon />}
                />
            )}
            {Object.values(resources)
                .filter(r => r.hasList)
                .map(resource => (
                    <IconMenu.Item
                        key={resource.name}
                        name={resource.name}
                        to={`/${resource.name}`}
                        label={translatedResourceName(resource, translate)}
                        icon={
                            resource.icon ? <resource.icon /> : <DefaultIcon />
                        }
                    />
                ))}
        </IconMenu>
    );
};

export interface IconMenuResourcesProps extends IconMenuProps {
    hasDashboard: boolean;
}

IconMenuResources.propTypes = {
    hasDashboard: PropTypes.bool,
};

const translatedResourceName = (resource: any, translate: Translate): string =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });
