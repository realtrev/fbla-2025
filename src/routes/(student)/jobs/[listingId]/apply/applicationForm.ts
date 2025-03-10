import { z } from "zod";
import { BinarySize } from '$lib/utils';

export const applicationSchema = z.object({
	message: z.string(),
	resume: z.any({
		message: "Resume or transcript is required",
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
			message: "Resume or transcript is required",
		})
		.refine((file) => {
			if (!(file instanceof File)) {
				return true;
			}

			// check that it is less than 512KB
			return file.size < BinarySize.fromMegabytes(5).bytes;
		}, {
			message: "Resume or transcript must be less than 5MB",
		}),
});

export type FormSchema = typeof applicationSchema;