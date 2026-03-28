// scripts/seedStudents.js
// Run this ONCE to populate your Firestore with student data.
//
// Usage:
//   node scripts/seedStudents.js
//
// Prerequisites:
//   npm install firebase-admin
//   Download your service account key from:
//   Firebase Console → Project Settings → Service Accounts → Generate New Private Key
//   Save it as scripts/serviceAccountKey.json

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// ─────────────────────────────────────────────
// Student data — add more students here as needed
// NOTE: doc ID should be the Firebase Auth UID of the student.
//       For seeding without auth, we use rollNo as the doc ID,
//       and the Profile component can be adjusted accordingly.
//
// Format: rollNo (lowercase) → student record
// ─────────────────────────────────────────────
const students = [
  {
    uid: 'jxoA2guOw1MGdSNsA20iIUC78E73',       // ← Replace with actual Firebase Auth UID
    name: 'Harshit Singh',
    email: 'b23133@students.iitmandi.ac.in',
    hostelBlock: 'Suvalsar',
    affiliatedMess: 'Alder',
    avatarUrl: '',
  },
  {
    uid: '6qAdRGBF7rWp3lZ5orQurKGmnTL2',       // ← Replace with actual Firebase Auth UID
    name: 'Bhumika',
    email: 'b23144@students.iitmandi.ac.in',
    hostelBlock: 'Gauri Kund',
    affiliatedMess: 'Alder',
    avatarUrl: '',
  },
  // Add more students here:
  // {
  //   uid: 'UID_OF_STUDENT',
  //   name: 'Student Name',
  //   email: 'bXXXXX@students.iitmandi.ac.in',
  //   hostelBlock: 'Block Name',
  //   affiliatedMess: 'Mess Name',
  //   avatarUrl: '',
  // },
]

async function seedDatabase() {
  console.log('🌱 Seeding Firestore with student data...\n')

  for (const student of students) {
    const { uid, ...data } = student

    // Roll No is derived from email — no need to store separately
    await db.collection('students').doc(uid).set(data)
    console.log(`✅ Added: ${data.name} (${data.email})`)
  }

  console.log('\n🎉 Done! All students seeded successfully.')
  process.exit(0)
}

seedDatabase().catch((err) => {
  console.error('❌ Error seeding database:', err)
  process.exit(1)
})