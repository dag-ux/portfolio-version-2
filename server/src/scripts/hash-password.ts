import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Usage: npx tsx src/scripts/hash-password.ts <password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nCopy this to ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('');
});