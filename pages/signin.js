import React from "react";
import { providers, signIn, getSession, csrfToken } from "next-auth/client";
import Image from "next/image";
import Head from "next/head";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

export default function SignIn({ providers }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.ul
      className="container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.li className="item" variants={item}>
        <div className="bg-white h-screen">
          <Head>
            <title>Audible Sign in</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="https://www.audible.in/favicon.ico" />
          </Head>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Header />
              <div className="w-80 h-[70vh] mx-auto grid place-items-center bg-gray-100 mt-5 rounded-lg item">
                <Image
                  width={140}
                  height={54}
                  objectFit="contain"
                  src="https://m.media-amazon.com/images/G/31/audibleweb/arya/navigation/audible_logo._CB490888215_.svg"
                />
                <div>
                  <div>
                    {Object.values(providers).map((provider) => {
                      return (
                        <div key={provider.name}>
                          <button
                            className="button"
                            onClick={() => signIn(provider.id)}
                          >
                            Sign in with {provider.name}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.li>
    </motion.ul>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await providers(context),
      csrfToken: await csrfToken(context),
    },
  };
}
