import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  getTestById,
  startTest
} from "../services/testService";

import type {
  TestResponse
} from "../types/test";

function TestDetailsPage() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [test, setTest] =
    useState<TestResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchTest =
      async () => {

        try {

          if (!id) {
            return;
          }

          const data =
            await getTestById(
              Number(id)
            );

          setTest(data);

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchTest();

  }, [id]);

  if (loading) {

    return <h1>Loading...</h1>;
  }

  if (!test) {

    return <h1>Test not found</h1>;
  }

  const handleStartTest =
    async () => {

      try {

        await startTest(
          test.id
        );

        navigate(
          `/question/${test.id}`
        );

      } catch (error) {

        console.error(error);

        alert(
          "Unable to start test"
        );
      }
    };

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
          max-w-4xl
          mx-auto
          px-8
          py-12
        "
      >

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800

            rounded-3xl

            p-10
          "
        >

          <h1
            className="
              text-4xl
              font-bold
              mb-4
            "
          >
            {test.title}
          </h1>

          <p
            className="
              text-zinc-400
              text-lg
              mb-8
            "
          >
            {test.description}
          </p>

          <div
            className="
              flex
              flex-wrap
              gap-8
              mb-8
            "
          >

            <div>

              <p
                className="
                  text-zinc-500
                "
              >
                Questions
              </p>

              <p
                className="
                  text-xl
                  font-semibold
                "
              >
                {
                  test.questionIds.length
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-zinc-500
                "
              >
                Duration
              </p>

              <p
                className="
                  text-xl
                  font-semibold
                "
              >
                {
                  test.durationMinutes
                }
                {" "}
                mins
              </p>

            </div>

            <div>

              <p
                className="
                  text-zinc-500
                "
              >
                Status
              </p>

              <p
                className="
                  text-xl
                  font-semibold
                "
              >
                {
                  test.startTime
                    ? "Started"
                    : "Not Started"
                }
              </p>

            </div>

          </div>

          <button
            onClick={
              handleStartTest
            }
            className="
              bg-amber-400
              text-black

              font-semibold

              px-8
              py-4

              rounded-xl

              hover:bg-amber-300

              transition
            "
          >
            Start Test
          </button>

        </div>

      </div>

    </div>
  );
}

export default TestDetailsPage;