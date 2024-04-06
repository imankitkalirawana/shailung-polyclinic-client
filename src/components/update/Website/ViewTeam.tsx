import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/config";
import { useFormik } from "formik";

type team = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const ViewTeam = () => {
  const [processing, setProcessing] = useState(false);
  const formik = useFormik({
    initialValues: {
      team: [] as team[],
    },
    onSubmit: async (values) => {
      try {
        setProcessing(true);
        await axios.put(`${API_BASE_URL}/api/website/team`, values, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        toast.success("Team updated successfully");
      } catch (error: any) {
        toast.error(error.response.statusText);
      } finally {
        setProcessing(false);
      }
    },
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/website/team`);
        formik.setValues({
          team: response.data,
        });
      } catch (error: any) {
        toast.error(error.response.statusText);
      }
    };
    fetchTeam();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        const updatedTeam = [...formik.values.team];
        updatedTeam[index] = {
          ...updatedTeam[index],
          image: imageData,
        };
        formik.setValues({
          ...formik.values,
          team: updatedTeam,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-base-content">
            Team
          </h2>
          <p className="mt-1 text-sm leading-6 text-base-neutral">
            Update your team information.
          </p>
        </div>
      </div>

      {formik.values.team.map((member: team, index: number) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold leading-7 text-base-content">
                {member.name}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 col-span-full md:col-span-5 lg:col-span-9">
              <div className="sm:col-span-3">
                <label htmlFor={`team-name-${index}`} className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  id={`team-name-${index}`}
                  name="name"
                  type="text"
                  className="input input-bordered w-full"
                  value={member.name}
                  onChange={(e) => {
                    const updatedTeam = [...formik.values.team];
                    updatedTeam[index] = {
                      ...updatedTeam[index],
                      name: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      team: updatedTeam,
                    });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor={`team-role-${index}`} className="label">
                  <span className="label-text">Role</span>
                </label>
                <input
                  id={`team-role-${index}`}
                  name="role"
                  type="text"
                  className="input input-bordered w-full"
                  value={member.role}
                  onChange={(e) => {
                    const updatedTeam = [...formik.values.team];
                    updatedTeam[index] = {
                      ...updatedTeam[index],
                      role: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      team: updatedTeam,
                    });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor={`team-bio-${index}`} className="label">
                  <span className="label-text">Bio</span>
                </label>
                <input
                  id={`team-bio-${index}`}
                  name="bio"
                  type="text"
                  className="input input-bordered w-full"
                  value={member.bio}
                  onChange={(e) => {
                    const updatedTeam = [...formik.values.team];
                    updatedTeam[index] = {
                      ...updatedTeam[index],
                      bio: e.target.value,
                    };
                    formik.setValues({
                      ...formik.values,
                      team: updatedTeam,
                    });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label htmlFor={`team-image-${index}`} className="label">
                  <span className="label-text">Image</span>
                </label>
                <input
                  id={`team-image-${index}`}
                  name={`team-image-${index}`}
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            </div>
            <div className="w-full max-w-xs text-center col-span-2 md:col-span-3">
              <img
                src={member.image}
                alt=""
                className="object-cover object-center w-full h-48 mx-auto rounded-lg"
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium">{member.name}</h3>
                <span className="mt-1 font-medium">{member.role}</span>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </React.Fragment>
      ))}
      <div className="flex items-center gap-2 justify-end mt-12">
        <a href="/dashboard" className="btn btn-sm">
          Cancel
        </a>
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={processing}
        >
          {processing ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </form>
  );
};
