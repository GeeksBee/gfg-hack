import React from "react";

import { useSelector } from "react-redux";
import { states as indiaStates } from "../../data/states";
import { Combobox, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";

export default function SelectOrganizationType({ selected, setSelected }) {
  const { user } = useSelector((state) => state.user);

  // const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const filteredStates =
    query === ""
      ? indiaStates
      : indiaStates.filter((state) =>
          state.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <div className="relative cursor-default overflow-hidden bg-white text-left border w-full rounded-md px-1 mt-4 md:mt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(state) => state.name}
            placeholder={"Select your Organizations Type"}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            {/* <HiSelector
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    /> */}
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredStates.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredStates.map((state) => (
                <Combobox.Option
                  key={state.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={state}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {state.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          {/* <FiCheck
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
