import Elysia, { t } from "elysia";
import { AuthForbiddenError, AuthUnauthorizedError, auth } from "$lib/auth";
import { electionInfo } from "$lib/constants";
import { apiError, apiInternalError, apiOk, mergeUnionEnum } from "$lib/schema";
import { currentTime } from "$lib/time";
import { ElectionResult, Vote } from "./schema";
import { ElectionPeriodError, ElectionService, VoteError } from "./service";

export const electionRoutes = new Elysia({ aot: false });
