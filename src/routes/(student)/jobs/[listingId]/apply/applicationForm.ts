import { z } from "zod";
import { BinarySize } from '$lib/utils';

export const applicationSchema = z.object({
	message: z.string(),
	resume: z.any({
		message: "Resume is required",
	})
		.refine((file) => {
			if (file instanceof File) {
				return true;
			} else if (typeof file === "string") {
				return file.length > 0;
			} else if (file === undefined || file === null) {
				return false;
			}

			return true;
		}, {
			message: "Resume is required",
		})
		.refine((file) => {
			if (!(file instanceof File)) {
				return true;
			}

			// check that it is less than 512KB
			return file.size < BinarySize.fromKilobytes(512).bytes;
		}, {
			message: "Resume must be less than 512KB",
		}),
});

export type FormSchema = typeof applicationSchema;