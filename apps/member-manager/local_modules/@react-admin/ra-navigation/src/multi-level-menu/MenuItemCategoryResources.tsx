import PropTypes from 'prop-types';

import { IconMenuResources, IconMenuResourcesProps } from './IconMenuResources';

// re-exported for backwards compatibility
export const MenuItemCategoryResources = IconMenuResources;

export type MenuItemCategoryResourcesProps = IconMenuResourcesProps;

MenuItemCategoryResources.propTypes = {
    hasDashboard: PropTypes.bool,
};
