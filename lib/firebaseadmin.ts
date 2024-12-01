import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "awesome-84d1b",
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIEMT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
}

export const verifyIdToken = async (token: string) => {
  return await admin.auth().verifyIdToken(token);
};
