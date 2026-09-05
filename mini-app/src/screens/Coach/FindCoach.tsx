import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./FindCoach.css";

type Props = {
  onBack: () => void;
  onOpenCoach: (
    coachId: number
  ) => void;
};

type MarketplaceCoach = {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;

  stats: {
    clients: number;
    workouts: number;
    programs: number;
  };

  user: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;
  };
};

type MarketplaceResponse = {
  success: boolean;

  coaches: MarketplaceCoach[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export default function FindCoach({
  onBack,
  onOpenCoach,
}: Props) {
  const [coaches, setCoaches] =
    useState<MarketplaceCoach[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const normalizedSearch =
    useMemo(
      () =>
        search.trim(),
      [search]
    );

  async function loadCoaches(
    targetPage = 1
  ) {
    try {
      setLoading(true);
      setError(null);

      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(targetPage)
      );

      params.set(
        "limit",
        "20"
      );

      if (
        normalizedSearch
      ) {
        params.set(
          "search",
          normalizedSearch
        );
      }

      const response =
        await api.get<MarketplaceResponse>(
          `/coaches/marketplace?${params.toString()}`,
          telegramAuthOptions()
        );

      console.log(
        "IRONAGE DEBUG: MARKETPLACE RESPONSE",
        response
      );

      if (
        !response ||
        !Array.isArray(
          response.coaches
        )
      ) {
        throw new Error(
          "Invalid marketplace response"
        );
      }

      setCoaches(
        response.coaches
      );

      setPage(
        response.pagination
          ?.page ?? 1
      );

      setPages(
        response.pagination
          ?.pages ?? 1
      );

      setTotal(
        response.pagination
          ?.total ?? 0
      );
    } catch (err) {
      console.error(
        "IRONAGE FIND COACH ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load coaches"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          void loadCoaches(
            1
          );
        },
        300
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [normalizedSearch]);

  return (
    <main className="find-coach">
      <div className="find-coach__content">
        <header className="find-coach__header">
          <button
            type="button"
            className="find-coach__back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE COACHES
            </span>

            <h1>
              FIND A COACH
            </h1>

            <p>
              {total} COACHES
            </p>
          </div>
        </header>

        <section className="find-coach__search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Search coach or specialization"
          />
        </section>

        {loading && (
          <section className="find-coach__state">
            <strong>
              LOADING COACHES...
            </strong>
          </section>
        )}

        {!loading &&
          error && (
            <section className="find-coach__state find-coach__state--error">
              <strong>
                CONNECTION ERROR
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadCoaches(
                    page
                  )
                }
              >
                RETRY
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          coaches.length ===
            0 && (
            <section className="find-coach__state">
              <strong>
                NO COACHES FOUND
              </strong>

              <p>
                Try another
                search.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          coaches.length >
            0 && (
            <section className="find-coach__list">
              {coaches.map(
                (coach) => (
                  <button
                    key={
                      coach.userId
                    }
                    type="button"
                    className="find-coach__card"
                    onClick={() =>
                      onOpenCoach(
                        coach.userId
                      )
                    }
                  >
                    <div className="find-coach__photo">
                      {coach.photoUrl ? (
                        <img
                          src={
                            coach.photoUrl
                          }
                          alt={
                            coach.displayName
                          }
                        />
                      ) : (
                        <span>
                          {coach.displayName
                            .slice(
                              0,
                              1
                            )
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="find-coach__main">
                      <div className="find-coach__name">
                        <strong>
                          {
                            coach.displayName
                          }
                        </strong>

                        {coach.isVerified && (
                          <span>
                            ✓
                          </span>
                        )}
                      </div>

                      <p>
                        {coach.specialization ??
                          "IRONAGE COACH"}
                      </p>

                      {coach.bio && (
                        <small>
                          {
                            coach.bio
                          }
                        </small>
                      )}

                      <div className="find-coach__stats">
                        <span>
                          <b>
                            {
                              coach
                                .stats
                                .clients
                            }
                          </b>
                          CLIENTS
                        </span>

                        <span>
                          <b>
                            {
                              coach
                                .stats
                                .programs
                            }
                          </b>
                          PROGRAMS
                        </span>

                        <span>
                          <b>
                            {
                              coach
                                .stats
                                .workouts
                            }
                          </b>
                          WORKOUTS
                        </span>
                      </div>
                    </div>

                    <div className="find-coach__arrow">
                      →
                    </div>
                  </button>
                )
              )}
            </section>
          )}

        {!loading &&
          !error &&
          pages > 1 && (
            <section className="find-coach__pagination">
              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  void loadCoaches(
                    page - 1
                  )
                }
              >
                ←
              </button>

              <span>
                {page} / {pages}
              </span>

              <button
                type="button"
                disabled={
                  page >= pages
                }
                onClick={() =>
                  void loadCoaches(
                    page + 1
                  )
                }
              >
                →
              </button>
            </section>
          )}
      </div>
    </main>
  );
}
