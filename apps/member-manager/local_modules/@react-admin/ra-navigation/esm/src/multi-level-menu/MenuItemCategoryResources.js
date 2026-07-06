import PropTypes from 'prop-types';
import { IconMenuResources } from './IconMenuResources';
// re-exported for backwards compatibility
export var MenuItemCategoryResources = IconMenuResources;
MenuItemCategoryResources.propTypes = {
    hasDashboard: PropTypes.bool,
};
