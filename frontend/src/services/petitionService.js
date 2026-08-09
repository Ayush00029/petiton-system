import API from './api';

// Citizen: Get all approved petitions (optional category filter)
export const getApprovedPetitions = async (category = '') => {
  return await API.get('/petitions', { params: { category } });
};

// Citizen/Public: Get petition details by ID
export const getPetitionById = async (id) => {
  return await API.get(`/petitions/${id}`);
};

// Citizen: Create petition
export const createPetition = async (petitionData) => {
  return await API.post('/petitions', petitionData);
};

// Citizen: Get my created petitions
export const getMyPetitions = async () => {
  return await API.get('/petitions/user/my');
};

// Citizen: Sign petition with digital signature
export const signPetition = async (id, signatureData) => {
  return await API.post(`/petitions/${id}/sign`, signatureData);
};

// Citizen: Revoke/Withdraw digital signature
export const revokeSignature = async (id) => {
  return await API.delete(`/petitions/${id}/sign`);
};

// Protected: Push petition to Government Department when goal is hit
export const pushToGovernment = async (id) => {
  return await API.post(`/petitions/${id}/push-to-government`);
};

// Citizen: Check if user has signed
export const checkSignatureStatus = async (id) => {
  return await API.get(`/petitions/${id}/signed`);
};

// Admin: Get all petitions (pending, approved, rejected, submitted_to_government)
export const getAllPetitionsAdmin = async (status = '') => {
  return await API.get('/petitions/admin/all', { params: { status } });
};

// Admin: Approve or Reject petition
export const updatePetitionStatusAdmin = async (id, status) => {
  return await API.put(`/petitions/admin/${id}/status`, { status });
};

// Admin: Delete petition
export const deletePetitionAdmin = async (id) => {
  return await API.delete(`/petitions/admin/${id}`);
};
