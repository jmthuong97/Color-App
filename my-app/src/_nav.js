export default {
    items: [{
            name: 'Manage posts',
            url: '/ManagePost',
            icon: 'icon-speedometer',
            badge: {
                variant: 'info',
                text: 'NEW',
            },
        }, {
            title: true,
            name: 'ManagePost',
            wrapper: { // optional wrapper object
                element: '', // required valid HTML5 element tag
                attributes: {} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: '' // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Manage Groups',
            url: '/theme/ManageGroups',
        },
        {
            name: 'Typography',
            url: '/theme/typography',
            icon: 'icon-pencil',
        },
    ],
};