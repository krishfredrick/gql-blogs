
export default (obj: any)=>{
  const { createdAt, updatedAt} = obj;
  return {...obj, createdAt: createdAt?.toISOString(), updatedAt: updatedAt?.toISOString()}
}