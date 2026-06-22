// <div>
//                     <h3 className="text-xs font-semibold text-foreground mb-3">
//                       Payment Information
//                     </h3>

//                     {subLoading ? (
//                       <p className="text-xs text-muted-foreground">
//                         Loading...
//                       </p>
//                     ) : subscription ? (
//                       <div className="space-y-2">
//                         {/* 🔥 CASE 1: SUBSCRIPTION NOT YET SYNCED (WEBHOOK DELAY) */}
//                         {!subscription.stripe_subscription_id ? (
//                           <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 space-y-2">
//                             <div>
//                               <div className="text-xs justify-between flex font-semibold text-foreground mb-2">
//                                 <span> Subscription Control </span>

//                                 <span className="text-destructive">
//                                   {" "}
//                                   {subscription && (
//                                     <div className="text-[10px] text-muted-foreground">
//                                       Current:{" "}
//                                       <span className="font-semibold text-foreground">
//                                         {subscription.status}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </span>
//                               </div>

//                               {subLoading ? (
//                                 <p className="text-xs text-muted-foreground">
//                                   Loading...
//                                 </p>
//                               ) : (
//                                 <div className="space-y-3">
//                                   {/* STATUS DROPDOWN */}
//                                   <select
//                                     className="w-full border p-2 rounded text-xs"
//                                     value={subStatus}
//                                     onChange={(e) =>
//                                       setSubStatus(e.target.value)
//                                     }
//                                   >
//                                     {/* <option value="trialing">
//                                       Trialing
//                                     </option> */}
//                                     <option value="active">Active</option>

//                                     <option value="inactive">
//                                       Inactive
//                                     </option>
//                                   </select>

//                                   {/* UPDATE BUTTON */}
//                                   <Button
//                                     onClick={handleUpdateSubscriptionStatus}
//                                     disabled={updatingSub}
//                                     className="w-full text-xs"
//                                   >
//                                     {updatingSub
//                                       ? "Updating..."
//                                       : "Update Status"}
//                                   </Button>

//                                   {/* CURRENT STATUS DISPLAY */}
//                                   {/* {subscription && (
//                                     <div className="text-[10px] text-muted-foreground">
//                                       Current:{" "}
//                                       <span className="font-semibold text-foreground">
//                                         {subscription.status}
//                                       </span>
//                                     </div>
//                                   )} */}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ) : (
//                           <>
//                             {/* ✅ STATUS */}
//                             <div className="flex-col-2 rounded-lg border border-border p-3">
//                               <div className="text-[10px] text-muted-foreground">
//                                 Status :{" "}
//                                 <span
//                                   className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
//                                     subscription.status === "active"
//                                       ? "bg-green-100 text-green-700"
//                                       : subscription.status === "trialing"
//                                         ? "bg-blue-100 text-blue-700"
//                                         : subscription.status === "past_due"
//                                           ? "bg-cyan-100 text-cyan-700"
//                                           : "bg-red-100 text-red-700"
//                                   }`}
//                                 >
//                                   {subscription.status}
//                                 </span>
//                               </div>

//                               {/* {(subscription.status === "active" ||
//                                 subscription.status === "trialing" ||
//                                 subscription.status === "past_due") && (
//                                 <Button
//                                   onClick={async () => {
//                                     try {
//                                       await axios.post(
//                                         `${API_BASE}/pay/cancel-subscription`,
//                                         {
//                                           userId: selected.id,
//                                         },
//                                       );

//                                       toast.success(
//                                         "Subscription will be canceled",
//                                       );
//                                       handleSelectUser(selected);
//                                     } catch {
//                                       toast.error(
//                                         "Failed to cancel subscription",
//                                       );
//                                     }
//                                   }}
//                                   variant="destructive"
//                                   className="w-full mt-2 text-xs"
//                                 >
//                                   Cancel Subscription
//                                 </Button>
//                               )} */}
//                               {(subscription.status === "active" ||
//                                 subscription.status === "trialing" ||
//                                 subscription.status === "past_due") && (
//                                 <Button
//                                   onClick={async () => {
//                                     try {
//                                       await axios.post(
//                                         `${API_BASE}/pay/cancel-subscription`,
//                                         { userId: selected.id },
//                                       );
//                                       toast.success(
//                                         "Subscription will be canceled after period ends",
//                                       );
//                                       setCancelAtPeriodEnd(true); // ← instantly disables
//                                     } catch {
//                                       toast.error(
//                                         "Failed to cancel subscription",
//                                       );
//                                     }
//                                   }}
//                                   variant="destructive"
//                                   className="w-full mt-2 text-xs"
//                                   disabled={cancelAtPeriodEnd} // ← disabled if already canceled
//                                 >
//                                   {cancelAtPeriodEnd
//                                     ? "Cancellation Scheduled"
//                                     : "Cancel Subscription"}
//                                 </Button>
//                               )}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 space-y-2">
//                         <div>
//                           <div className="text-xs justify-between flex font-semibold text-foreground mb-2">
//                             <span> Subscription Control </span>

//                             <span className="text-destructive">
//                               {" "}
//                               {subscription && (
//                                 <div className="text-[10px] text-muted-foreground">
//                                   Current:{" "}
//                                   <span className="font-semibold text-foreground">
//                                     {subscription.status}
//                                   </span>
//                                 </div>
//                               )}
//                             </span>
//                           </div>

//                           {subLoading ? (
//                             <p className="text-xs text-muted-foreground">
//                               Loading...
//                             </p>
//                           ) : (
//                             <div className="space-y-3">
//                               {/* STATUS DROPDOWN */}
//                               <select
//                                 className="w-full border p-2 rounded text-xs"
//                                 value={subStatus}
//                                 onChange={(e) =>
//                                   setSubStatus(e.target.value)
//                                 }
//                               >
//                                 {/* <option value="trialing">Trialing</option> */}
//                                 <option value="active">Active</option>
//                                 <option value="inactive">Inactive</option>
//                               </select>

//                               {/* UPDATE BUTTON */}
//                               <Button
//                                 onClick={handleUpdateSubscriptionStatus}
//                                 disabled={updatingSub}
//                                 className="w-full text-xs"
//                               >
//                                 {updatingSub
//                                   ? "Updating..."
//                                   : "Update Status"}
//                               </Button>

//                               {/* CURRENT STATUS DISPLAY */}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
