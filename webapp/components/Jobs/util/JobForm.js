import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { Fragment, useState } from "react";
import JobFormComp from "../form";

export default function JobForm({
  openModal,
  closeModal,
  createJob,
  setCreateJob,
  submitJobFunction,
}) {
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/job/group", createJob, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          Cookies: `accessToken=${Cookies.get("accessToken")}`,
        },
        crossDomain: true,
      });

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Job Form
                </Dialog.Title>

                <JobFormComp
                  createJob={createJob}
                  setCreateJob={setCreateJob}
                />
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex mr-2 justify-center rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={async () => {
                      console.log("hi");
                      handleSubmit();
                      //
                    }}
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
