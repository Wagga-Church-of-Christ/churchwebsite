import React from 'react';
import Helmet from 'react-helmet'

import { ThemeProvider } from 'styled-components'

import config from '../../utils/siteConfig'

import GlobalStyle from '../../styles/global'
import theme from '../../styles/theme'

import Header from '../header/Header';
import Footer from '../footer/Footer';

import './Template.scss';

const Template = (props) => {
  return (
    <div>
      <Helmet>
        <title>{config.siteTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <Header />
      <ThemeProvider theme={theme}>
        {props.children}
      </ThemeProvider>
      <GlobalStyle />
      <Footer />
    </div>
  );
}

export default Template;
