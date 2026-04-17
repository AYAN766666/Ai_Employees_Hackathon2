import React from 'react';
import Layout from '@theme-original/Layout';
import ChatAgent from '@site/src/components/ChatAgent'; // Import the ChatAgent component
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function LayoutWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const bookName = siteConfig.title || 'Your Book'; // Fallback title

  return (
    <Layout {...props}>
      {props.children}
      <ChatAgent bookName={bookName} />
    </Layout>
  );
}
