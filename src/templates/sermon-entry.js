import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import config from '../utils/siteConfig'
import Sermon from '../components/Sermon'
import Container from '../components/Container'
import PostLinks from '../components/PostLinks'
import SEO from '../components/SEO'

import Template from '../components/template/Template'

const SermonEntryTemplate = ({ data, pageContext }) => {
  const root = '/sermons/'
  const postNode = data.contentfulSermon

  const {
    title,
    slug
  } = postNode

  const previous = pageContext.prev
  const next = pageContext.next

  return (
    <Template >
      <div>
        <Helmet>
          <title>{`${title} - ${config.siteTitle}`}</title>
        </Helmet>
        <SEO pagePath={slug} postNode={postNode} postSEO root={root} />

        <Container>
          <Sermon {...postNode} />
        </Container>
        <PostLinks previous={previous} next={next} root={root} name="Sermon" />
      </div>
    </Template>
  )
}

export const query = graphql`
  query($slug: String!) {
    contentfulSermon(slug: { eq: $slug }) {
      title
      slug
      publishDate(formatString: "DD MMMM, YYYY")
      publishDateISO: publishDate(formatString: "YYYY-MM-DD")
      speaker
      audioLink
      description {
        childMarkdownRemark {
          html
          excerpt(pruneLength: 320)
        }
      }
      body: description {
        childMarkdownRemark {
          html
          excerpt(pruneLength: 80)
        }
      }
    }
  }
`

export default SermonEntryTemplate
