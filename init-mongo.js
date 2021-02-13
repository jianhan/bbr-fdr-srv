db.createUser({
  user: 'username',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'bbr-fdr-srv',
    },
  ],
});
