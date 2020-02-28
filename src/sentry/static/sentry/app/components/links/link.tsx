import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router';
import {Location, LocationDescriptor} from 'history';
import * as Sentry from '@sentry/browser';

type ToLocationFunction = (location: Location) => LocationDescriptor;

type Props = {
  // Link content (accepted via string or components / DOM nodes)
  // TODO(Priscila): check why some components don't pass any children. Ex: CommitRow
  children?: React.ReactNode;
  // Optional URL
  to?: string | ToLocationFunction | LocationDescriptor;
  // Action to perform when clicked
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
  // Styles applied to the component's root
  className?: string;
  // Specifies extra information about the element
  title?: string;
  // TODO (Priscila): check if disabled is being used together with some css seletor
  // if yes move to className, since it is not an anchor attribute
  disabled?: boolean;
};

/**
 * A context-aware version of Link (from react-router) that falls
 * back to <a> if there is no router present
 */
class Link extends React.Component<Props> {
  static contextTypes = {
    location: PropTypes.object,
  };

  componentDidMount() {
    const {to} = this.props;
    const isRouterPresent = this.context.location;
    if (typeof to !== 'string' && !isRouterPresent) {
      Sentry.captureException(
        new Error('The link component was rendered without being wrapped by a <Router />')
      );
    }
  }

  render() {
    const {to = '#', ...props} = this.props;

    if (typeof to !== 'string') {
      return <RouterLink to={to} {...props} />;
    }

    return <a href={to} {...props} />;
  }
}

export default Link;
