import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllTests
} from "../services/testService";

import type {
  TestResponse
} from "../types/test";

function DashboardPage() {

  const navigate =
    useNavigate();

  const [tests, setTests] =
    useState<TestResponse[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchTests =
      async () => {

        try {

          const data =
            await getAllTests();

          setTests(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchTests();

  }, []);

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "
      >
        <h1>Loading...</h1>
      </div>

    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
          px-8
          py-10
        "
      >

        <div
          className="
            mb-10
          "
        >

          <h1
            className="
              text-5xl
              font-bold
              mb-2
            "
          >
            Available Tests
          </h1>

          <p
            className="
              text-zinc-400
              text-lg
            "
          >
            Welcome back,
            {" "}
            {
              sessionStorage.getItem(
                "name"
              )
            }
            👋
          </p>

        </div>

        <div
          className="
            flex
            flex-col
            gap-5
          "
        >

          {
            tests.map(test => (

              <div
                key={test.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800

                  rounded-2xl

                  px-8
                  py-6

                  flex
                  flex-col
                  md:flex-row

                  md:items-center
                  md:justify-between

                  gap-4

                  hover:border-amber-400

                  transition-all
                  duration-300
                "
              >

                <div>

                  <h3
                    className="
                      text-2xl
                      font-semibold
                      mb-2
                    "
                  >
                    Test #{test.id}
                  </h3>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-6

                      text-zinc-400
                    "
                  >

                    <span>
                      Questions:
                      {" "}
                      {
                        test.questionIds.length
                      }
                    </span>

                    <span>
                      Status:
                      {" "}
                      {
                        test.startTime
                          ? "Started"
                          : "Not Started"
                      }
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/tests/${test.id}`
                    )
                  }
                  className="
                    bg-amber-400
                    text-black

                    font-semibold

                    px-6
                    py-3

                    rounded-xl

                    hover:bg-amber-300

                    transition

                    self-start
                    md:self-auto
                  "
                >
                  Open Test
                </button>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;