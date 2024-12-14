import * as masterRecordsService from '../services/masterRecordsService.js';
import { NotFoundError } from '../utils/errors.js';

export const getNetworks = async (req, res, next) => {
  try {
    const networks = await masterRecordsService.findNetworks(req.query);
    res.json(networks);
  } catch (error) {
    next(error);
  }
};

export const createNetwork = async (req, res, next) => {
  try {
    const network = await masterRecordsService.createNetwork(req.body);
    res.status(201).json(network);
  } catch (error) {
    next(error);
  }
};

export const updateNetwork = async (req, res, next) => {
  try {
    const network = await masterRecordsService.updateNetwork(req.params.id, req.body);
    res.json(network);
  } catch (error) {
    next(error);
  }
};

export const deleteNetwork = async (req, res, next) => {
  try {
    await masterRecordsService.deleteNetwork(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Similar functions for centers, departments, etc.