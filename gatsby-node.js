const config = require('./src/utils/siteConfig')
const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const allComplete = Promise.all([
    createHomePage(createPage),
    createWhoWeArePage(createPage),
    createWhatWeBelievePage(createPage),
    createWhatsOnPage(createPage),
    createSermons(createPage, graphql)
  ])

  return allComplete
}


function createWhoWeArePage(createPage) {
  const promise = new Promise((resolve, reject) => {
    createPage({
      path: `/who-we-are`,
      component: path.resolve(`./src/components/about/AboutPage.tsx`),
      context: {
        defaultSection: 0
      },
    })
    resolve()
  })

  return promise
}

function createWhatWeBelievePage(createPage) {
  const promise = new Promise((resolve, reject) => {
    createPage({
      path: `/confession-of-faith`,
      component: path.resolve(`./src/components/about/AboutPage.tsx`),
      context: {
        defaultSection: 1
      },
    })
    resolve()
  })

  return promise
}

function createWhatsOnPage(createPage) {
  const promise = new Promise((resolve, reject) => {
    createPage({
      path: `/whats-on`,
      component: path.resolve(`./src/components/about/AboutPage.tsx`),
      context: {
        defaultSection: 2
      },
    })
    resolve()
  })

  return promise
}

function createHomePage(createPage) {
  const promise = new Promise((resolve, reject) => {
    createPage({
      path: `/`,
      component: path.resolve(`./src/components/home/HomePage.tsx`)
    })
    resolve()
  })

  return promise
}


function createSermons(createPage, graphql) {
  const promise = new Promise((resolve, reject) => {
    graphql(`
      {
        allContentfulSermon(
          sort: { fields: [publishDate], order: DESC }
          limit: 10000
        ) {
          edges {
            node {
              slug
              publishDate
            }
          }
        }
      }
    `).then(result => {
      const posts = result.data.allContentfulSermon.edges
      const postsPerFirstPage = config.postsPerHomePage
      const postsPerPage = config.postsPerPage
      const numPages = Math.ceil(
        posts.slice(postsPerFirstPage).length / postsPerPage
      )

      createPage({
        path: `/sermons/`,
        component: path.resolve(`./src/templates/sermon-index.js`),
        context: {
          limit: postsPerFirstPage,
          skip: 0,
          numPages: numPages + 1,
          currentPage: 1
        },
      })

      // Create additional pagination on home page if needed
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: `/sermons/${i + 2}/`,
          component: path.resolve(`./src/templates/sermon-index.js`),
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage + postsPerFirstPage,
            numPages: numPages + 1,
            currentPage: i + 2
          },
        })
      })

      // Create each individual post
      posts.forEach((edge, i) => {
        const prev = i === 0 ? null : posts[i - 1].node
        const next = i === posts.length - 1 ? null : posts[i + 1].node
        createPage({
          path: `/sermons/${edge.node.slug}/`,
          component: path.resolve(`./src/templates/sermon-entry.js`),
          context: {
            slug: edge.node.slug,
            prev,
            next
          },
        })
      })
      resolve()
    })
  })

  return promise
}

