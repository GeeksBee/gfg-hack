import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../AdminLayout/util/JobCard";

function DisplayJobs({ selectedJob, setSelectedJob, query }) {
  const { jobs } = useSelector((state) => state.jobs);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    let newArr = [...jobs].filter((e, i) =>
      String(e.title).toLowerCase().includes(String(query).toLowerCase())
    );
    setFilteredJobs([...newArr]);
    console.log(newArr);
  }, [query]);

  return (
    <>
      {jobs.length === 0 ? (
        <div></div>
      ) : filteredJobs.length > 0 ? (
        filteredJobs.map((e, i) => (
          <>
            {e.title !== "test" && e.title !== "string" && (
              <JobCard
                jobObject={e}
                isEditable={true}
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
              />
            )}
          </>
        ))
      ) : (
        jobs.map((e, i) => (
          <>
            {e.title !== "test" && e.title !== "string" && (
              <JobCard
                jobObject={e}
                isEditable={true}
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
              />
            )}
          </>
        ))
      )}
    </>
  );
}

export default DisplayJobs;
