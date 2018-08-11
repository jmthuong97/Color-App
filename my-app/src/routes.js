import React from 'react';
import Loadable from 'react-loadable'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return (
    <Segment>
      <Dimmer active inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
      <Image src='https://semantic-ui.com/images/wireframe/paragraph.png' />
    </Segment>)
}

const ManagePost = Loadable({
  loader: () => import('./views/NewsFeed/ManagePost'),
  loading: Loading,
});

const Groups = Loadable({
  loader: () => import('./views/Theme/Groups'),
  loading: Loading,
});

const Typography = Loadable({
  loader: () => import('./views/Theme/Typography'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/ManagePost', name: 'ManagePost', component: ManagePost },
  { path: '/theme', exact: true, name: 'Theme', component: Groups },
  { path: '/theme/ManageGroups', name: 'ManageGroups', component: Groups },
  { path: '/theme/typography', name: 'Typography', component: Typography },
];

export default routes;
