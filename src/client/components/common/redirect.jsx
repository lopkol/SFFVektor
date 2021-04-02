'use strict';

const React = require('react');
const { useNavigate } = require('react-router-dom');

function Navigate({ to }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(to);
  }, []);

  return <div/>;
}

module.exports = Navigate;
