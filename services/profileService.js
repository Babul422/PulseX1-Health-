const userRepository = require('../repositories/userRepository');
const { supabaseAdmin } = require('../config/supabase');
const { isDummyMode } = require('../config/dataConfig');

class ProfileService {
  async getProfile(userId) {
    return userRepository.getProfile(userId);
  }

  async updateProfile(userId, profileData) {
    if (isDummyMode()) {
      const existing = await userRepository.getProfile(userId);
      const updated = Object.assign({}, existing, profileData);
      return updated;
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async uploadAvatar(userId, fileBuffer, fileMime, fileName) {
    if (isDummyMode() || !supabaseAdmin) {
      // Return Data-URL for local / offline preview
      const base64 = fileBuffer.toString('base64');
      const dataUrl = `data:${fileMime || 'image/png'};base64,${base64}`;
      await this.updateProfile(userId, { avatar_url: dataUrl });
      return dataUrl;
    }

    try {
      const path = `avatars/${userId}_${Date.now()}_${fileName || 'avatar.png'}`;
      const { data, error } = await supabaseAdmin.storage
        .from('avatars')
        .upload(path, fileBuffer, { contentType: fileMime, upsert: true });

      if (error) {
        // If bucket does not exist, use base64 data-URL
        const base64 = fileBuffer.toString('base64');
        return `data:${fileMime || 'image/png'};base64,${base64}`;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('avatars')
        .getPublicUrl(path);

      const avatarUrl = publicUrlData.publicUrl;
      await this.updateProfile(userId, { avatar_url: avatarUrl });
      return avatarUrl;
    } catch (err) {
      const base64 = fileBuffer.toString('base64');
      return `data:${fileMime || 'image/png'};base64,${base64}`;
    }
  }
}

module.exports = new ProfileService();
