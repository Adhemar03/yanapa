const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

class RequestsService {
  async createRequest({
    userId,
    categoryId,
    categoryName,
    description,
    address,
    phone,
    preferredDate,
  }) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .insert([
          {
            cliente_id: userId,
            categoria_id: parseInt(categoryId, 10),
            descripcion: description,
            direccion: address,
            estado: 'PENDIENTE',
            fecha_solicitud: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        throw new Error(`Error creating request: ${error.message}`);
      }

      return data[0];
    } catch (error) {
      throw new Error(`Error en createRequest: ${error.message}`);
    }
  }

  async getRequestsByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .select('*')
        .eq('cliente_id', userId)
        .order('fecha_solicitud', { ascending: false });

      if (error) {
        throw new Error(`Error fetching requests: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Error en getRequestsByUser: ${error.message}`);
    }
  }

  async getRequestById(requestId) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .select('*')
        .eq('id_solicitud', requestId)
        .single();

      if (error) {
        throw new Error(`Error fetching request: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Error en getRequestById: ${error.message}`);
    }
  }

  async updateRequestStatus(requestId, status) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .update({
          estado: status,
        })
        .eq('id_solicitud', requestId)
        .select();

      if (error) {
        throw new Error(`Error updating request: ${error.message}`);
      }

      return data[0];
    } catch (error) {
      throw new Error(`Error en updateRequestStatus: ${error.message}`);
    }
  }

  async cancelRequest(requestId) {
    try {
      return await this.updateRequestStatus(requestId, 'cancelada');
    } catch (error) {
      throw new Error(`Error en cancelRequest: ${error.message}`);
    }
  }

  async getRequestHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .select('*')
        .eq('cliente_id', userId)
        .in('estado', ['FINALIZADO', 'CANCELADO'])
        .order('fecha_finalizacion', { ascending: false });

      if (error) {
        throw new Error(`Error fetching history: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Error en getRequestHistory: ${error.message}`);
    }
  }

  async getActiveRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('solicitudes_servicio')
        .select('*')
        .eq('cliente_id', userId)
        .in('estado', ['PENDIENTE', 'ACEPTADO', 'EN_PROCESO'])
        .order('fecha_solicitud', { ascending: false });

      if (error) {
        throw new Error(`Error fetching active requests: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      throw new Error(`Error en getActiveRequests: ${error.message}`);
    }
  }
}

module.exports = new RequestsService();
