'use strict';

const React = require('react');
const { Link } = require('react-router-dom');
const { Box, Typography, Button } = require('@mui/material');

function NotFound() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 5, alignItems: 'center' }}>
      <Typography variant="h5" sx={{ marginBottom: 4 }}>
        A keresett oldal nem található
      </Typography>
      <Button variant="contained" component={Link} to="/" color="primary">
        Vissza a kezdőlapra
      </Button>
    </Box>
  );
}

module.exports = NotFound;
