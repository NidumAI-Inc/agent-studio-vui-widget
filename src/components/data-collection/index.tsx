import { useForm } from 'react-hook-form';

import { endPoints } from '../../utils/end-points';
import useUIStore from "../../store/ui";

function DataCollection() {
  const collectionArr = useUIStore(s => s.data?.data_collections)
  const update = useUIStore(s => s.update)
  const id = useUIStore(s => s.id)

  const { register, formState: { errors }, handleSubmit } = useForm()

  async function onSubmit(data: any) {
    try {
      const response = await fetch(`${endPoints.mlBackend}/save_data`, {
        method: "POST",
        body: JSON.stringify({
          agent_id: id.split("_")[1],
          user_id: id.split("_")[0],
          data
        }),
        headers: {
          "content-type": "application/json",
        }
      })
      await response.json()
      update({ data_collected: true })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='scroll-y relative overflow-hidden'>
      {/* <span className='absolute top-6 h-16 w-full skew-y-12 bg-gray-50 z-[-1]'></span>
      <span className='absolute bottom-6 h-16 w-full skew-y-12 bg-gray-50 z-[-1]'></span> */}

      <span className='absolute top-0 -translate-y-6 -translate-x-4 size-36 rounded-full bg-gray-50 z-[-1]'></span>
      <span className='absolute bottom-0 right-0 size-36 translate-y-6 translate-x-4 rounded-full bg-gray-50 z-[-1]'></span>

      <form
        className="grid place-items-center h-full p-6 text-black overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='p-4 w-full rounded-lg'>
          {
            collectionArr
              ?.filter(i => i.enabled)
              ?.map((item, i) => {
                if (item.type === "number") {
                  return (
                    <div key={i} className="mb-3">
                      <label htmlFor={`id-${i}`}>{item.name}</label>
                      <input
                        id={`id-${i}`}
                        type="number"
                        className="pl-2 pr-0"
                        max={item.max || Infinity}
                        min={item.min || -Infinity}
                        {...register(item.name, {
                          required: {
                            value: item.required,
                            message: `${item.name} is required`,
                          },
                          min: {
                            value: item.min || -Infinity,
                            message: `${item.name} should be greather than ${item.min}`
                          },
                          max: {
                            value: item.max || Infinity,
                            message: `${item.name} should be greather than ${item.max}`
                          }
                        })}
                      />
                      {
                        errors[item.name] &&
                        // @ts-ignore
                        <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                      }
                    </div>
                  )
                }

                if (item.type === "multiselect") {
                  return (
                    <div key={i} className="mb-3">
                      <label htmlFor={`id-${i}`} className='mb-1'>{item.name}</label>
                      <div className='df gap-x-4 flex-wrap'>
                        {
                          item.options.map((op, j) => (
                            <div key={op.value} className="df gap-1">
                              <input
                                type="checkbox"
                                id={`op-${i}-${j}`}
                                value={op.value}
                                {...register(item.name, {
                                  required: {
                                    value: item.required,
                                    message: `${item.name} is required`,
                                  },
                                  // validate: (val) => {
                                  //   if (item.required && val && val.length === 0) {
                                  //     return 'Please select at least one op'
                                  //   }
                                  // }
                                })}
                                className="h-4 w-4 accent-primary border-gray-200"
                              />
                              <label htmlFor={`op-${i}-${j}`}>
                                {op.value}
                              </label>
                            </div>
                          ))
                        }
                      </div>
                      {
                        errors[item.name] &&
                        // @ts-ignore
                        <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                      }
                    </div>
                  )
                }

                if (item.type === "select") {
                  return (
                    <div key={i} className="mb-3">
                      <label htmlFor={`id-${i}`}>{item.name}</label>
                      <select
                        id={`id-${i}`}
                        className="p-1"
                        {...register(item.name, {
                          required: {
                            value: item.required,
                            message: `${item.name} is required`
                          }
                        })}
                      >
                        <option value="" disabled>Select an item</option>
                        {
                          item.options.map(op => (
                            <option
                              key={op.value}
                              value={op.value}
                            >
                              {op.value}
                            </option>
                          ))
                        }
                      </select>
                      {
                        errors[item.name] &&
                        // @ts-ignore
                        <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                      }
                    </div>
                  )
                }

                if (item.type === "textarea") {
                  return (
                    <div key={i} className="mb-3">
                      <div className='df justify-between'>
                        <label htmlFor={`id-${i}`}>{item.name}</label>
                        {item.maxChar && <span className='text-[9px] text-primary-foreground/70'>Max {item.maxChar} char</span>}
                      </div>
                      <textarea
                        id={`id-${i}`}
                        maxLength={item.maxChar || Infinity}
                        {...register(item.name, {
                          required: {
                            value: item.required,
                            message: `${item.name} is required`
                          },
                          maxLength: {
                            value: item.maxChar || Infinity,
                            message: `${item.name} should be greather than ${item.maxChar}`
                          }
                        })}
                      ></textarea>
                      {
                        errors[item.name] &&
                        // @ts-ignore
                        <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                      }
                    </div>
                  )
                }

                if (item.type === "text") {
                  return (
                    <div key={i} className="mb-3">
                      <div className='df justify-between'>
                        <label htmlFor={`id-${i}`}>{item.name}</label>
                        {item.maxChar && <span className='text-[9px] text-primary-foreground/70'>Max {item.maxChar} char</span>}
                      </div>
                      <input
                        id={`id-${i}`}
                        type="text"
                        maxLength={item.maxChar || Infinity}
                        {...register(item.name, {
                          required: {
                            value: item.required,
                            message: `${item.name} is required`
                          },
                          maxLength: {
                            value: item.maxChar || Infinity,
                            message: `${item.name} should be greather than ${item.maxChar}`
                          }
                        })}
                      />
                      {
                        errors[item.name] &&
                        // @ts-ignore
                        <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                      }
                    </div>
                  )
                }

                return (
                  <div key={i} className="mb-3">
                    <label htmlFor={`id-${i}`}>{item.name}</label>
                    <input
                      id={`id-${i}`}
                      type={item.type}
                      {...register(item.name, {
                        required: {
                          value: item.required,
                          message: `${item.name} is required`
                        },
                      })}
                    />
                    {
                      errors[item.name] &&
                      // @ts-ignore
                      <p className='text-[10px] text-red-400'>{errors?.[item?.name]?.message || ""}</p>
                    }
                  </div>
                )
              })
          }

          <button
            type="submit"
            className="block mx-auto mt-4 mb-8 px-8 py-1 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/80 shadow"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default DataCollection
