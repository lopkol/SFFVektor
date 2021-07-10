'use strict';

const React = require('react');
const { getAuthorAndTitle } = require('../../lib/useful-stuff');
const MolyLink = require('../common/data-display/moly-link');

function BookWithMolyLinks({ book }) {
  const [links] = React.useState(book.alternatives.find(alternative => alternative.name === 'magyar') ? book.alternatives.find(alternative => alternative.name === 'magyar').urls : []);

  return (
    <span>
      { getAuthorAndTitle(book) }
      { links.map(link => (
        <MolyLink url={link} key={link}/>
      )) }
    </span>
  );
}

module.exports = BookWithMolyLinks;
