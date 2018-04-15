module.exports = {
  siteMetadata: {
    title: 'Insomnia',
    description: 'A powerful REST API Client with cookie management, environment variables, code generation, and authentication for Mac, Window, and Linux',
    siteUrl: 'https://insomnia.rest/',
    shortName: 'Insomnia',
    name: 'Insomnia REST Client',
    author: 'Gregory Schier',
    copyright: 'Floating Keyboard Software',
    copyrightURL: 'https://floatingkeyboard.com'
  },
  plugins: [
    'gatsby-plugin-react-next',
    {
      resolve: 'gatsby-plugin-less',
      options: {
        theme: {
          // Override Less variables here
        },
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-9837747-12',
        head: false,
        respectDNT: true,
        exclude: [],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'changelog',
        path: `${__dirname}/content/changelog/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/content/blog/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'page',
        path: `${__dirname}/content/pages/`,
      },
    },
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        setup: function setup({query}) {
          const {site, ...rest} = query;
          // NOTE: We should be getting siteMetadata from the query results
          // but the feed plugin is too shitty to work with multiple feeds.
          // Check on this later

          return {
            ...module.exports.siteMetadata,
            ...rest
          };
        },
        feeds: [
          feedOptions('blog'),
          feedOptions('changelog'),
        ]
      }
    }
  ],
};

function feedOptions(name) {
  return {
    output: `/${name}/index.xml`,
    serialize: result => {
      const {query: {site, allFile}} = result;
      // NOTE: We should be getting siteMetadata from the query results
      // but the feed plugin is too shitty to work with multiple feeds.
      // Check on this later
      return allFile.edges
        .sort((a, b) => {
          const tsA = new Date(a.node.childMarkdownRemark.frontmatter.date).getTime();
          const tsB = new Date(b.node.childMarkdownRemark.frontmatter.date).getTime();
          return tsB - tsA;
        })
        .map(({node: {childMarkdownRemark: {html, frontmatter}}}) => {
          const urlPath = `${name}/${frontmatter.slug}`;
          return {
            ...frontmatter,
            description: html,
            url: module.exports.siteMetadata.siteUrl + urlPath,
            guid: urlPath
          };
        });
    },
    query: `
      {
        allFile(filter: {sourceInstanceName: {eq: "${name}"}}) {
          edges {
            node {
              childMarkdownRemark {
                html
                frontmatter {
                  date
                  slug
                  title
                }
              }
            }
          }
        }
      }
    `
  }
}