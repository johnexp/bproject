'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke User meta Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/user-bible-data/:book/:chapter',
      permissions: '*'
    }, {
      resources: '/api/user-notes-search/:searchTerm/:book*?',
      permissions: '*'
    }, {
      resources: '/api/user-tags-search/:book*?',
      permissions: '*'
    }, {
      resources: '/api/user-markers-search/:book*?',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/user-bible-data/:book/:chapter',
      permissions: '*'
    }, {
      resources: '/api/user-notes-search/:searchTerm/:book*?',
      permissions: ['get']
    }, {
      resources: '/api/user-tags-search/:book*?',
      permissions: ['post']
    }, {
      resources: '/api/user-markers-search/:book*?',
      permissions: ['post']
    }]
  }]);
};

/**
 * Check If User meta Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an User metum is being processed and the current user created it then allow any manipulation
  if (req.userBibleData && req.user && req.userBibleData.user && req.userBibleData.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        if (roles[0] === 'guest') {
          return res.status(401).json({
            message: 'É necessário se autenticar para acessar esse recurso.'
          });
        }
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
