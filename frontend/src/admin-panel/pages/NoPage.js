import React from "react";


const NoPage = () => {


  return (
    <div className="admin-page-not-found">
      <div className="page-body">
        <section className="error-section pt-0">
          <div className="banner-content text-center">
            <img className="img-fluid banner-img mx-auto" src="/images/404.png" alt="404"></img>
            <p>
              The page you are looking for could not be found. The link to this
              address may be outdated or we may have moved the page since you last
              bookmarked it.
            </p>
            <a href="/admin/" className="btn theme-outline d-inline-flex mx-auto">Back To Home</a>
          </div>
        </section>
      </div>

    </div>

  )
};

export default NoPage;
