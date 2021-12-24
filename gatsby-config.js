const dayjs = require("dayjs");

module.exports = {
  siteMetadata: {
    siteUrl: "https://blog.aoirint.com",
    title: "Eyamigusa",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        // defaultLayouts: {
        //   default: require.resolve("./src/components/MdxLayout.tsx"),
        // },
        extensions: [
          '.mdx',
          '.md',
        ],
        gatsbyRemarkPlugins: [
          "gatsby-remark-autolink-headers",
          "gatsby-remark-relative-images",
          "gatsby-remark-images",
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "entry",
        path: "./src/entry/",
      },
      __key: "entry",
    },
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        nodeType: 'Mdx',
        timezone: 'Asia/Tokyo',
        publishDraft: process.env.NODE_ENV !== 'production',
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-157155944-5",
        head: true,
      },
    },
    "gatsby-plugin-twitter",
    {
      resolve: "gatsby-plugin-graphql-codegen",
      options: {
        fileName: "generated/graphql-types.ts",
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.filter(node => {
                const parent = node.parent
                const sourceInstanceName = 'sourceInstanceName' in parent ? parent.sourceInstanceName : 'pages'
                return sourceInstanceName === 'entry'
              }).map(node => {
                const parent = node.parent
                const sourceInstanceName = 'sourceInstanceName' in parent ? parent.sourceInstanceName : 'pages'
                const pathPrefix = sourceInstanceName !== 'pages' ? `/${sourceInstanceName}/` : '/'

                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + pathPrefix + node.slug,
                  guid: site.siteMetadata.siteUrl + pathPrefix + node.slug,
                  custom_elements: [
                    {
                      "content:encoded": node.html,
                    },
                    node.frontmatter.updated ? {
                      "atom:updated": dayjs(node.frontmatter.updated).toString(),
                    } : {},
                  ],
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] }
                  limit: 10
                  filter: {fields: {draft: {eq: false}}}
                ) {
                  nodes {
                    excerpt
                    html
                    slug
                    frontmatter {
                      title
                      date
                      updated
                    }
                    parent {
                      ... on File {
                        sourceInstanceName
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "えやみぐさ's RSS Feed",
          },
        ],
      },
    },
  ],
};
